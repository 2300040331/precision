import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Folder,
  Trash2,
  Copy,
  Check,
  FileText,
  Video,
  File,
  X,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';

export default function MediaLibraryView({ media, onUpload, onUpdate, onDelete }) {
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const folderConfig = [
    { id: 'all', label: 'All Website Media' },
    { id: 'logos', label: 'Logos & Branding' },
    { id: 'hero', label: 'Hero & Banners' },
    { id: 'about', label: 'About & Leadership' },
    { id: 'services', label: 'Services & Methodology' },
    { id: 'insights', label: 'Insights & Articles' },
    { id: 'testimonials', label: 'Client Testimonials' },
    { id: 'industries', label: 'Industries We Serve' },
    { id: 'contact', label: 'Contact & Location' },
    { id: 'documents', label: 'Documents & Files' },
  ];

  const safeMedia = Array.isArray(media) ? media : [];

  const filteredMedia = safeMedia.filter(m => {
    const matchesFolder = selectedFolder === 'all' || m?.folder === selectedFolder;
    const matchesSearch = !search || m?.filename?.toLowerCase().includes(search.toLowerCase()) || (m?.altText && m?.altText?.toLowerCase().includes(search.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const targetFolder = selectedFolder === 'all' ? 'general' : selectedFolder;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let uploadedUrl = null;

        // Try posting directly to Vercel Blob storage API handler
        try {
          const res = await fetch(`/api/uploadImage?filename=${encodeURIComponent(file.name)}`, {
            method: 'POST',
            headers: api.getHeaders(false),
            body: file,
          });
          if (res.ok) {
            const blobData = await res.json();
            if (blobData && blobData.url) {
              uploadedUrl = blobData.url;
            }
          }
        } catch (blobErr) {
          console.warn('Vercel Blob direct upload fallback:', blobErr);
        }

        if (uploadedUrl) {
          const mediaObj = {
            filename: file.name,
            originalName: file.name,
            url: uploadedUrl,
            mimeType: file.type || 'image/jpeg',
            size: file.size,
            folder: targetFolder,
            altText: file.name.replace(/\.[^/.]+$/, ''),
          };
          await onUpload(mediaObj);
        } else {
          throw new Error(`Vercel Blob could not upload ${file.name}. No browser-only fallback is used.`);
        }
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Enterprise Media Library</h1>
            <p className="text-slate-400 text-xs">Organized section-by-section. Manage, upload, and assign photos to specific website sections.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <label className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 cursor-pointer transition-all border border-indigo-400/30">
            <Upload className="w-4 h-4 mr-2" />
            <span>{isUploading ? 'Uploading...' : 'Upload Media Files'}</span>
            <input type="file" multiple onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Main Layout: Folder Sidebar (3 cols) + Asset Grid (6 cols) + Inspector Panel (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Folders List (3 cols) */}
        <div className="lg:col-span-3 bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-3">
          <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-slate-800 pb-2">Section Folders</span>
          <div className="space-y-1 text-xs">
            {folderConfig.map(f => {
              const count = f.id === 'all' ? media.length : media.filter(m => m.folder === f.id).length;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFolder(f.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                    selectedFolder === f.id
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate mr-1">
                    <Folder className={`w-4 h-4 shrink-0 ${selectedFolder === f.id ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="truncate">{f.label}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${selectedFolder === f.id ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Media Assets Grid (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images by filename or alt text..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            {filteredMedia.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-500 text-xs">No media files found in this folder.</div>
            ) : (
              filteredMedia.map(item => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-xl ring-2 ring-indigo-500/40'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="h-32 bg-slate-950 flex items-center justify-center overflow-hidden p-2">
                      {item.mimeType.startsWith('image/') ? (
                        <img src={item.url} alt={item.altText || item.filename} className="h-full w-full object-contain" />
                      ) : (
                        <FileText className="w-10 h-10 text-slate-600" />
                      )}
                    </div>
                    <div className="p-2.5 bg-slate-900 border-t border-slate-800/80">
                      <p className="text-[11px] font-semibold text-white truncate">{item.filename}</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider">{Math.round(item.size / 1024)} KB</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Asset Inspector Panel (3 cols) */}
        <div className="lg:col-span-3 bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-4 text-xs">
          <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-slate-800 pb-2">Asset Details</span>
          {selectedItem ? (
            <div className="space-y-4">
              <div className="h-40 bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-center justify-center overflow-hidden">
                {selectedItem.mimeType.startsWith('image/') ? (
                  <img src={selectedItem.url} alt={selectedItem.filename} className="max-h-full max-w-full object-contain" />
                ) : (
                  <FileText className="w-12 h-12 text-slate-500" />
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">File Name</span>
                  <span className="font-semibold text-white break-all">{selectedItem.filename}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">URL Path</span>
                  <div className="flex items-center space-x-1 mt-1">
                    <input
                      type="text"
                      readOnly
                      value={selectedItem.url}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[10px] text-indigo-400 font-mono"
                    />
                    <button
                      onClick={() => handleCopyUrl(selectedItem.url, selectedItem.id)}
                      className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                      title="Copy URL"
                    >
                      {copiedId === selectedItem.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Assigned Section Folder</span>
                  <select
                    value={selectedItem.folder || 'general'}
                    onChange={(e) => {
                      const newFolder = e.target.value;
                      onUpdate(selectedItem.id, { folder: newFolder });
                      setSelectedItem(prev => ({ ...prev, folder: newFolder }));
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white mt-1 focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    {folderConfig.filter(f => f.id !== 'all').map(f => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Alt Text</span>
                  <input
                    type="text"
                    value={selectedItem.altText || ''}
                    onChange={(e) => onUpdate(selectedItem.id, { altText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white mt-1 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  onDelete(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-semibold flex items-center justify-center"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete Asset
              </button>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-10">Select an asset to view details and edit metadata.</p>
          )}
        </div>
      </div>
    </div>
  );
}
