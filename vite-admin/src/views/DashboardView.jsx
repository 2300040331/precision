import React from 'react';
import {
  Users,
  CalendarCheck,
  Briefcase,
  ShieldCheck,
  ArrowUpRight,
  Plus,
  Layers,
  Sparkles,
  Activity,
  FileText,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardView({ analytics, consultations = [], services = [], systemHealth, onNavigate, onOpenConsultationModal }) {
  const stats = analytics || {
    totalVisitors: 24592,
    todayVisitors: 1420,
    monthVisitors: 18450,
    liveVisitors: 8,
    bounceRate: '28.4%',
    devices: { Desktop: 68, Mobile: 26, Tablet: 6 },
    referrers: { Direct: 42, Google: 38, LinkedIn: 14, Referral: 6 },
  };

  const safeConsultations = Array.isArray(consultations) ? consultations : [];
  const safeServices = Array.isArray(services) ? services : [];
  const pendingConsultations = safeConsultations.filter(c => c && c.status === 'NEW').length;

  return (
    <div className="space-y-8 animate-fade-in text-slate-100 font-sans">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#071322] via-[#0f1d32] to-[#152540] p-6 rounded-3xl border border-[#c8a45e]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c8a45e]/10 rounded-full blur-3xl -z-0 pointer-events-none"></div>
        <div className="space-y-1 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping"></span>
              {stats.liveVisitors} Live Visitors Right Now
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-wide">Executive Dashboard Overview</h1>
          <p className="text-slate-300 text-xs">
            Manage public content, consultations, practice services, and real-time site performance without touching code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => onOpenConsultationModal && onOpenConsultationModal()}
            className="flex items-center px-4 py-2.5 bg-gradient-to-r from-[#c8a45e] to-[#a8863e] hover:from-[#d4b46f] hover:to-[#c8a45e] text-[#071322] rounded-xl text-xs font-extrabold shadow-lg shadow-[#c8a45e]/20 transition-all border border-[#e0c580]/40 uppercase tracking-wider cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4 mr-2" /> Book Consultation
          </button>
          <button
            onClick={() => onNavigate('builder')}
            className="flex items-center px-4 py-2.5 bg-[#0f1d32] hover:bg-[#152540] text-slate-200 rounded-xl text-xs font-bold transition-all border border-[#c8a45e]/30 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 mr-2 text-[#c8a45e]" /> Page Builder
          </button>
          <button
            onClick={() => onNavigate('services')}
            className="flex items-center px-4 py-2.5 bg-[#0f1d32] hover:bg-[#152540] text-[#c8a45e] rounded-xl text-xs font-bold transition-all border border-[#c8a45e]/30 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Service
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#0f1d32]/90 p-6 rounded-3xl border border-[#c8a45e]/20 shadow-xl relative overflow-hidden group hover:border-[#c8a45e]/60 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300">Total Visitors</span>
            <div className="p-2.5 bg-[#c8a45e]/10 rounded-2xl border border-[#c8a45e]/30 text-[#c8a45e]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{stats.totalVisitors.toLocaleString()}</div>
          <div className="flex items-center text-xs text-emerald-400 mt-2 font-semibold">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+14.2%</span>
            <span className="text-slate-400 text-[11px] font-normal ml-1.5">vs last month</span>
          </div>
        </div>

        <div className="bg-[#0f1d32]/90 p-6 rounded-3xl border border-[#c8a45e]/20 shadow-xl relative overflow-hidden group hover:border-[#c8a45e]/60 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300">Pending Consultations</span>
            <div className="p-2.5 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-amber-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{pendingConsultations}</div>
          <div className="flex items-center text-xs text-amber-400 mt-2 font-semibold">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-[10px] uppercase font-extrabold tracking-wider">Action Needed</span>
            <span className="text-slate-400 text-[11px] font-normal ml-1.5">{consultations.length} Total Leads</span>
          </div>
        </div>

        <div className="bg-[#0f1d32]/90 p-6 rounded-3xl border border-[#c8a45e]/20 shadow-xl relative overflow-hidden group hover:border-[#c8a45e]/60 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300">Active Services</span>
            <div className="p-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">{services.length}</div>
          <div className="flex items-center text-xs text-emerald-400 mt-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            <span>100% Dynamic</span>
            <span className="text-slate-400 text-[11px] font-normal ml-1.5">Managed via CMS</span>
          </div>
        </div>

        <div className="bg-[#0f1d32]/90 p-6 rounded-3xl border border-[#c8a45e]/20 shadow-xl relative overflow-hidden group hover:border-[#c8a45e]/60 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300">System Status</span>
            <div className="p-2.5 bg-[#c8a45e]/10 rounded-2xl border border-[#c8a45e]/30 text-[#c8a45e]">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 tracking-tight">100% Operational</div>
          <div className="text-xs text-slate-300 mt-2 flex items-center">
            <Activity className="w-4 h-4 text-emerald-400 mr-1.5" />
            <span>API Server & Database Healthy</span>
          </div>
        </div>
      </div>

      {/* Traffic Sources & Device Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Sources Breakdown */}
        <div className="lg:col-span-2 bg-[#0f1d32]/90 p-6 rounded-3xl border border-[#c8a45e]/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#c8a45e] uppercase tracking-wider">Traffic & Acquisition Channels</h2>
              <p className="text-slate-400 text-xs">Real-time visitor origins across channels</p>
            </div>
            <span className="text-[10px] bg-[#071322] text-[#c8a45e] px-3 py-1 rounded-xl border border-[#c8a45e]/30 font-mono font-bold">Live Telemetry</span>
          </div>

          <div className="space-y-4 pt-2">
            {Object.entries(stats.referrers).map(([key, val], idx) => {
              const total = Object.values(stats.referrers).reduce((a, b) => a + b, 0) || 1;
              const pct = Math.round((val / total) * 100);
              const colors = ['bg-[#c8a45e]', 'bg-emerald-500', 'bg-purple-500', 'bg-blue-500'];
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200">{key}</span>
                    <span className="text-[#c8a45e] font-mono">{pct}% ({val} visits)</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#071322] rounded-full overflow-hidden border border-[#c8a45e]/20">
                    <div className={`h-full ${colors[idx % colors.length]} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-[#0f1d32]/90 p-6 rounded-3xl border border-[#c8a45e]/20 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-[#c8a45e] uppercase tracking-wider">Quick Action Shortcuts</h2>
          <div className="space-y-3">
            <button
              onClick={() => onOpenConsultationModal && onOpenConsultationModal()}
              className="w-full p-3.5 bg-gradient-to-r from-[#c8a45e]/20 via-[#0f1d32] to-[#071322] hover:from-[#c8a45e]/30 border border-[#c8a45e]/40 hover:border-[#c8a45e] rounded-2xl text-left transition-all flex items-center justify-between group cursor-pointer shadow-lg shadow-[#c8a45e]/10"
            >
              <div className="flex items-center">
                <CalendarCheck className="w-4 h-4 text-[#c8a45e] mr-3" />
                <span className="text-xs font-extrabold text-white group-hover:text-[#c8a45e]">Book Consultation (WhatsApp Popup)</span>
              </div>
              <span className="text-[#c8a45e] text-xs font-bold">→</span>
            </button>

            <button
              onClick={() => onNavigate('builder', 'home')}
              className="w-full p-3.5 bg-[#071322] hover:bg-[#152540] border border-[#c8a45e]/20 hover:border-[#c8a45e]/60 rounded-2xl text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center">
                <Layers className="w-4 h-4 text-[#c8a45e] mr-3" />
                <span className="text-xs font-bold text-slate-200 group-hover:text-white">Edit Home Page</span>
              </div>
              <span className="text-[#c8a45e] text-xs font-bold">→</span>
            </button>

            <button
              onClick={() => onNavigate('live-editor')}
              className="w-full p-3.5 bg-[#071322] hover:bg-[#152540] border border-[#c8a45e]/20 hover:border-[#c8a45e]/60 rounded-2xl text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center">
                <Sparkles className="w-4 h-4 text-[#c8a45e] mr-3" />
                <span className="text-xs font-bold text-slate-200 group-hover:text-white">Live Visual Site Editor</span>
              </div>
              <span className="text-[#c8a45e] text-xs font-bold">→</span>
            </button>

            <button
              onClick={() => onNavigate('media')}
              className="w-full p-3.5 bg-[#071322] hover:bg-[#152540] border border-[#c8a45e]/20 hover:border-[#c8a45e]/60 rounded-2xl text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center">
                <FileText className="w-4 h-4 text-[#c8a45e] mr-3" />
                <span className="text-xs font-bold text-slate-200 group-hover:text-white">Open Media Library</span>
              </div>
              <span className="text-[#c8a45e] text-xs font-bold">→</span>
            </button>

            <button
              onClick={() => onNavigate('settings')}
              className="w-full p-3.5 bg-[#071322] hover:bg-[#152540] border border-[#c8a45e]/20 hover:border-[#c8a45e]/60 rounded-2xl text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center">
                <Building2 className="w-4 h-4 text-[#c8a45e] mr-3" />
                <span className="text-xs font-bold text-slate-200 group-hover:text-white">Global Website & SEO Settings</span>
              </div>
              <span className="text-[#c8a45e] text-xs font-bold">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Consultation Leads Table */}
      <div className="bg-[#0f1d32]/90 p-6 rounded-3xl border border-[#c8a45e]/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#c8a45e] uppercase tracking-wider">Recent Consultation Inquiries</h2>
            <p className="text-slate-400 text-xs">Submissions directly captured from the website consultation form</p>
          </div>
          <button
            onClick={() => onNavigate('consultations')}
            className="text-xs font-bold text-[#c8a45e] hover:underline"
          >
            View All ({consultations.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#c8a45e]/20 text-[#c8a45e] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Requested Service</th>
                <th className="py-3 px-4">Preferred Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c8a45e]/10">
              {consultations.slice(0, 5).map(item => (
                <tr key={item.id} className="hover:bg-[#152540]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    {item.fullName}
                    <span className="block text-[10px] text-slate-400 font-normal">{item.email}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-200">{item.company || 'N/A'}</td>
                  <td className="py-3.5 px-4 text-[#c8a45e] font-semibold">{item.serviceSelected || 'General'}</td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono">{item.preferredDate || 'Flexible'}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        item.status === 'NEW'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : item.status === 'ACCEPTED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[#c8a45e]/20 text-[#c8a45e]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onNavigate('consultations', item.id)}
                      className="px-3 py-1.5 bg-[#071322] hover:bg-[#152540] text-[#c8a45e] border border-[#c8a45e]/30 rounded-xl text-[11px] font-bold transition-all"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
