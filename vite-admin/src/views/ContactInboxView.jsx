import React, { useState } from 'react';
import { Inbox, Mail, Search, Trash2, CheckCircle, Reply, Archive } from 'lucide-react';

export default function ContactInboxView({ contacts, onUpdateStatus, onDelete }) {
  const [selectedContact, setSelectedContact] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [replyNote, setReplyNote] = useState('');

  const safeContacts = Array.isArray(contacts) ? contacts : [];

  const filtered = safeContacts.filter(c => {
    const matchesStatus = statusFilter === 'ALL' || c?.status === statusFilter;
    const matchesSearch = !search || c?.name?.toLowerCase().includes(search.toLowerCase()) || c?.email?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Contact Form Inbox</h1>
            <p className="text-slate-400 text-xs">Manage general inquiry form messages sent from the public website.</p>
          </div>
        </div>
      </div>

      {/* Main Mailbox Grid: Left List (5 cols) + Right Message View (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 shadow-xl space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            {filtered.length === 0 ? (
              <p className="text-slate-500 text-center py-10 text-xs">No inbox messages found.</p>
            ) : (
              filtered.map(msg => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedContact(msg);
                    if (msg.status === 'UNREAD') {
                      onUpdateStatus(msg.id, { status: 'READ' });
                    }
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedContact?.id === msg.id
                      ? 'bg-blue-600/20 border-blue-500/50 shadow-md'
                      : msg.status === 'UNREAD'
                      ? 'bg-slate-950 border-slate-800 font-bold'
                      : 'bg-slate-900/40 border-slate-800/60 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white font-semibold">{msg.name}</span>
                    <span className="text-[10px] text-slate-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-blue-400 font-medium truncate">{msg.subject || 'Website Inquiry'}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-normal">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Inspector View (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 p-6 rounded-2xl border border-slate-800/80 shadow-xl space-y-5 text-xs">
          {selectedContact ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white">{selectedContact.subject || 'Website Inquiry'}</h2>
                  <span className="text-[11px] text-slate-400">From: {selectedContact.name} ({selectedContact.email})</span>
                </div>

                <button
                  onClick={() => {
                    onDelete(selectedContact.id);
                    setSelectedContact(null);
                  }}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{selectedContact.message}</p>
              </div>

              {/* Internal Reply Note */}
              <div className="space-y-2 pt-2">
                <label className="text-slate-300 font-semibold block">Internal Resolution / Reply Note</label>
                <textarea
                  rows={3}
                  value={replyNote || selectedContact.replyNote || ''}
                  onChange={(e) => setReplyNote(e.target.value)}
                  placeholder="Record call outcome or reply notes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50"
                />
                <button
                  onClick={() => {
                    onUpdateStatus(selectedContact.id, { status: 'REPLIED', replyNote });
                    alert('Note saved and marked as Replied!');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg"
                >
                  Save Note & Mark Replied
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500">
              <Mail className="w-12 h-12 stroke-[1] mb-3 text-slate-700" />
              <p className="text-xs">Select a message from the left list to read details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
