import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

export default function BookConsultationModal({ isOpen, onClose, onAddConsultation, targetWhatsAppNumber = '919618757596' }) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [serviceSelected, setServiceSelected] = useState('Audit & Assurance');
  const [message, setMessage] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const servicesList = [
    'Audit & Assurance',
    'Taxation',
    'Business Advisory',
    'Virtual CFO',
    'Accounting & Bookkeeping',
    'Company Law & ROC',
    'Startup Advisory',
    'Regulatory Compliance',
    'Transaction Advisory',
    'Risk Advisory',
    'Valuation',
    'Wealth Advisory',
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!fullName.trim() || !phoneNumber.trim()) {
      setStatusMsg('Please provide your name and phone number.');
      return;
    }

    // Clean phone number or default to target WhatsApp number
    let cleanTarget = (targetWhatsAppNumber || '919618757596').replace(/[^0-9]/g, '');
    if (!cleanTarget) cleanTarget = '919618757596';

    // Build formatted message for WhatsApp
    const waMessage = 
`Hello Precision & Co.,

I would like to book a consultation.

*Full Name:* ${fullName.trim()}
*Phone Number:* ${phoneNumber.trim()}
*Email Address:* ${emailAddress.trim() || 'N/A'}
*Service of Interest:* ${serviceSelected}
*Message:* ${message.trim() || 'No details provided.'}`;

    const encodedText = encodeURIComponent(waMessage);
    const whatsappUrl = `https://wa.me/${cleanTarget}?text=${encodedText}`;

    // Record consultation lead locally/CMS if handler is passed
    if (onAddConsultation) {
      onAddConsultation({
        id: Date.now(),
        fullName: fullName.trim(),
        phone: phoneNumber.trim(),
        email: emailAddress.trim(),
        serviceSelected: serviceSelected,
        message: message.trim(),
        status: 'NEW',
        preferredDate: new Date().toLocaleDateString('en-GB'),
        createdAt: new Date().toISOString()
      });
    }

    setStatusMsg('Redirecting to WhatsApp...');

    // Open WhatsApp URL in new tab/window
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // Reset and close modal after short delay
    setTimeout(() => {
      setStatusMsg('');
      setFullName('');
      setPhoneNumber('');
      setEmailAddress('');
      setMessage('');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      {/* Modal Card matching screenshot design */}
      <div 
        className="w-full max-w-xl bg-[#0b1426] border border-[#c8a45e]/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden text-slate-100 font-sans"
        style={{ backgroundColor: '#0b1426' }}
      >
        {/* Decorative ambient glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#c8a45e]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-[#0f1d32] rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-[#c8a45e]" />
        </button>

        <form onSubmit={handleSendMessage} className="space-y-6 relative z-10">
          {statusMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Row 1: FULL NAME & PHONE NUMBER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold text-[#c8a45e] uppercase tracking-widest">
                FULL NAME
              </label>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#0b1426] border-b border-slate-700 focus:border-[#c8a45e] py-2 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold text-[#c8a45e] uppercase tracking-widest">
                PHONE NUMBER
              </label>
              <input
                type="text"
                required
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-[#0b1426] border-b border-slate-700 focus:border-[#c8a45e] py-2 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Row 2: EMAIL ADDRESS */}
          <div className="space-y-2">
            <label className="block text-[11px] font-extrabold text-[#c8a45e] uppercase tracking-widest">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full bg-[#0b1426] border-b border-slate-700 focus:border-[#c8a45e] py-2 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Row 3: SERVICE OF INTEREST */}
          <div className="space-y-2">
            <label className="block text-[11px] font-extrabold text-[#c8a45e] uppercase tracking-widest">
              SERVICE OF INTEREST
            </label>
            <div className="relative">
              <select
                value={serviceSelected}
                onChange={(e) => setServiceSelected(e.target.value)}
                className="w-full bg-[#0b1426] border-b border-slate-700 focus:border-[#c8a45e] py-2 pr-8 text-sm text-white focus:outline-none appearance-none cursor-pointer"
              >
                {servicesList.map((svc) => (
                  <option key={svc} value={svc} className="bg-[#0b1426] text-white">
                    {svc}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-slate-400">
                <svg className="w-4 h-4 fill-current text-[#c8a45e]" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Row 4: YOUR MESSAGE */}
          <div className="space-y-2">
            <label className="block text-[11px] font-extrabold text-[#c8a45e] uppercase tracking-widest">
              YOUR MESSAGE
            </label>
            <textarea
              rows={3}
              placeholder="Briefly describe your requirements..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#0b1426] border-b border-slate-700 focus:border-[#c8a45e] py-2 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors resize-none"
            ></textarea>
          </div>

          {/* Row 5: SEND MESSAGE BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-[#c8a45e] hover:bg-[#d4b46f] active:bg-[#b8944e] text-[#0b1426] font-extrabold text-sm tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-[#c8a45e]/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>SEND MESSAGE</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
