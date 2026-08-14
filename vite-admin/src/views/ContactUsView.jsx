import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Upload,
  Check,
  Save,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { uploadImageToBlob } from '../services/blobUpload';

const ImageDropzone = ({ value, onChange, label = 'Contact Hero Banner Picture' }) => {
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
      setUploadError(error.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-slate-300 font-semibold flex items-center justify-between text-xs">
        <span>{label}</span>
        {isUploading ? <span className="text-[10px] text-blue-400 font-bold">Uploading…</span> : value && <span className="text-[10px] text-emerald-400 font-bold flex items-center"><Check className="w-3 h-3 mr-1" /> Image Loaded</span>}
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
          isDragging ? 'border-blue-400 bg-blue-500/10' : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
        }`}
      >
        {value ? (
          <div className="relative w-full group">
            <img src={value} alt="Uploaded preview" className="h-44 w-full object-cover rounded-xl border border-slate-800 shadow-md" />
            <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center space-x-3">
              <label className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg">
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
            <div className="p-3 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Drag & drop picture here</p>
              <p className="text-[11px] text-slate-400 mt-0.5">or <span className="text-blue-400 font-semibold underline">click to select image</span></p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </label>
        )}
      </div>
      {uploadError && <p className="text-[11px] text-red-400">{uploadError}</p>}
    </div>
  );
};

export default function ContactUsView({ initialData, onSave }) {
  const defaultValues = {
    heroTitle: 'Contact Us',
    heroSubtitle: 'Connect with our experts to discuss your financial strategy and compliance needs.',
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',

    heading: 'Get in Touch',
    text: 'Reach out to our Bengaluru headquarters for comprehensive financial advisory and auditing services.',
    
    primaryPhone: '+91 9618757596',
    secondaryPhone: '+44 7887 186675',
    
    primaryEmail: 'precisionandco26@gmail.com',
    secondaryEmail: 'precisionandcotech@gmail.com',
    
    headquarters: 'Hyderabad | Guntur',
    workingHours: 'Monday - Saturday: 9:00 AM - 6:30 PM IST',

    formHeading: 'Send Us a Message',
    formSubtitle: 'Fill out the form below and an advisory partner will contact you within 2 hours.',

    ctaTitle: 'Ready to Elevate Your Business?',
    ctaDescription: 'Partner with Precision & Co. for strategic financial guidance, unmatched expertise, and a commitment to your long-term success.',
    ctaButtonText: 'Book a Consultation',
  };

  const [form, setForm] = useState(initialData && Object.keys(initialData).length > 0 ? { ...defaultValues, ...initialData } : defaultValues);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSaveForm = async () => {
    setSaveError('');
    try {
      // Ensure aliased keys are populated so both old and new consumers get exact values
      const payload = {
        ...form,
        email: form.primaryEmail,
        taxEmail: form.secondaryEmail,
        advisoryEmail: form.secondaryEmail,
        phone: form.primaryPhone,
        altPhone: form.secondaryPhone,
        address: form.headquarters,
      };
      if (onSave) await onSave(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      setSaveError(error.message || 'Unable to publish contact settings. Please try again.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 font-sans pb-16">
      {/* Header Bar */}
      {saveError && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">{saveError}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Contact Us Page Manager</h1>
            <p className="text-slate-400 text-xs">Manage phone numbers, emails, addresses, subtitles, and contact form settings matching <code className="text-blue-400">contact.html</code>.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="https://precision-five-eta.vercel.app/contact.html"
            target="_blank"
            rel="noreferrer"
            className="flex items-center px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700"
          >
            <Globe className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> View Live Web Page
          </a>

          <button
            onClick={handleSaveForm}
            className="flex items-center px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-blue-500/20 transition-all border border-blue-400/40"
          >
            {saved ? <CheckCircle2 className="w-4 h-4 mr-1.5" /> : <Save className="w-4 h-4 mr-1.5" />}
            {saved ? 'Changes Saved Live!' : 'Save Contact Settings'}
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center justify-between animate-fade-in">
          <span className="flex items-center"><Check className="w-4 h-4 mr-2 text-emerald-400" /> Contact settings saved! Directly reflected on the main website (contact.html and global footers).</span>
          <span className="text-[10px] font-mono uppercase bg-emerald-500/20 px-2 py-0.5 rounded-full">Live Synced</span>
        </div>
      )}

      {/* SECTION 1: HERO BANNER */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
        <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider">1. Contact Hero Banner</h2>
        <ImageDropzone
          value={form.heroImage}
          onChange={(img) => setForm({ ...form, heroImage: img })}
          label="Hero Background Banner Picture"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="text-slate-300 font-semibold">Hero Subtitle</label>
            <input
              type="text"
              value={form.heroSubtitle}
              onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: CONTACT DETAILS & HEADQUARTERS ADDRESS */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
        <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider">2. Contact Details & Headquarters Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Section Heading</label>
            <input
              type="text"
              value={form.heading}
              onChange={(e) => setForm({ ...form, heading: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
              placeholder="Get in Touch"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Section Subtitle / Description Text</label>
            <input
              type="text"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300"
              placeholder="Reach out to our Bengaluru headquarters for comprehensive financial advisory and auditing services."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold flex items-center">
              <Phone className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> Primary Phone Number
            </label>
            <input
              type="text"
              value={form.primaryPhone}
              onChange={(e) => setForm({ ...form, primaryPhone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-indigo-400 font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold flex items-center">
              <Phone className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> Secondary Phone Number
            </label>
            <input
              type="text"
              value={form.secondaryPhone}
              onChange={(e) => setForm({ ...form, secondaryPhone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-indigo-400 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold flex items-center">
              <Mail className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> General Email Address
            </label>
            <input
              type="text"
              value={form.primaryEmail}
              onChange={(e) => setForm({ ...form, primaryEmail: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-blue-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold flex items-center">
              <Mail className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> Advisory Email Address
            </label>
            <input
              type="text"
              value={form.secondaryEmail}
              onChange={(e) => setForm({ ...form, secondaryEmail: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-blue-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> Headquarters Address
            </label>
            <textarea
              rows={2}
              value={form.headquarters}
              onChange={(e) => setForm({ ...form, headquarters: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> Working Hours
            </label>
            <input
              type="text"
              value={form.workingHours}
              onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: CONTACT FORM SETTINGS */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
        <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center">
          <MessageSquare className="w-4 h-4 mr-2" /> 3. Contact Form Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Form Heading</label>
            <input
              type="text"
              value={form.formHeading}
              onChange={(e) => setForm({ ...form, formHeading: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
              placeholder="Send Us a Message"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Form Subtitle</label>
            <input
              type="text"
              value={form.formSubtitle}
              onChange={(e) => setForm({ ...form, formSubtitle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300"
              placeholder="Fill out the form below and an advisory partner will contact you."
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: CALL TO ACTION */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl text-xs">
        <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center">
          <Sparkles className="w-4 h-4 mr-2" /> 4. Bottom Call to Action (CTA)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">CTA Title</label>
            <input
              type="text"
              value={form.ctaTitle}
              onChange={(e) => setForm({ ...form, ctaTitle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
              placeholder="Ready to Elevate Your Business?"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-slate-300 font-semibold">CTA Description</label>
            <input
              type="text"
              value={form.ctaDescription}
              onChange={(e) => setForm({ ...form, ctaDescription: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300"
              placeholder="Partner with Precision & Co. for strategic financial guidance..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
