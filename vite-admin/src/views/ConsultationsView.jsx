import React, { useState } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  Download,
  User,
  Mail,
  Phone,
  Building,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export default function ConsultationsView({ consultations, onUpdateStatus, onDelete }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState(null);

  const safeConsultations = Array.isArray(consultations) ? consultations : [];

  const filtered = safeConsultations.filter(c => {
    const matchesStatus = statusFilter === 'ALL' || c?.status === statusFilter;
    const matchesSearch =
      !search ||
      c?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      c?.email?.toLowerCase().includes(search.toLowerCase()) ||
      c?.company?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Company', 'Service', 'Industry', 'Budget', 'Date', 'Status'];
    const rows = filtered.map(c => [
      c.id,
      `"${c.fullName}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      `"${c.company || ''}"`,
      `"${c.serviceSelected || ''}"`,
      `"${c.industry || ''}"`,
      `"${c.budget || ''}"`,
      `"${c.preferredDate || ''}"`,
      `"${c.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `consultation_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Consultation Booking CRM</h1>
            <p className="text-slate-400 text-xs">Track, assign, schedule, and follow up with client consultation leads.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportCSV}
            className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all border border-slate-700"
          >
            <Download className="w-4 h-4 mr-2 text-purple-400" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, company..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center space-x-1 overflow-x-auto text-xs">
          {['ALL', 'NEW', 'IN_REVIEW', 'ACCEPTED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all uppercase tracking-wider text-[10px] ${
                statusFilter === st
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800/80 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Client Name & Contact</th>
              <th className="py-3.5 px-4">Requested Service</th>
              <th className="py-3.5 px-4">Message / Inquiry</th>
              <th className="py-3.5 px-4">Date & Time</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">No consultation requests have been submitted yet.</td>
              </tr>
            ) : (
              filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-xs">{item.fullName}</div>
                    <div className="text-[11px] text-indigo-400 font-mono">{item.phone}</div>
                    <div className="text-[10px] text-slate-400">{item.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {item.serviceSelected || 'General Consultation'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-slate-300 text-xs truncate" title={item.message}>
                      {item.message || 'No additional message provided.'}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-xs font-mono">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : item.preferredDate || 'Recent'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'NEW'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : item.status === 'ACCEPTED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {item.status || 'NEW'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedLead(item)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Lead Detail Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <h2 className="text-base font-bold text-white">Consultation Lead #{selectedLead.id} Details</h2>
              <button onClick={() => setSelectedLead(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Client Name</span>
                  <span className="font-semibold text-white text-sm">{selectedLead.fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Company / Organization</span>
                  <span className="font-semibold text-white text-sm">{selectedLead.company || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Email</span>
                  <span className="text-indigo-400">{selectedLead.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Phone Number</span>
                  <span className="text-slate-300">{selectedLead.phone}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold block">Client Inquiry Message</span>
                <p className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 leading-relaxed italic">
                  "{selectedLead.message || 'No additional notes provided.'}"
                </p>
              </div>

              {/* Status Update & Staff Assignment */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Lead Pipeline Status</label>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      onUpdateStatus(selectedLead.id, { status: newStatus });
                      setSelectedLead({ ...selectedLead, status: newStatus });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none"
                  >
                    <option value="NEW">NEW</option>
                    <option value="IN_REVIEW">IN_REVIEW</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="RESCHEDULED">RESCHEDULED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Assigned Staff Partner</label>
                  <input
                    type="text"
                    value={selectedLead.assignedStaff || ''}
                    onChange={(e) => {
                      const staff = e.target.value;
                      onUpdateStatus(selectedLead.id, { assignedStaff: staff });
                      setSelectedLead({ ...selectedLead, assignedStaff: staff });
                    }}
                    placeholder="e.g. Prakash V. (Senior Tax Partner)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
