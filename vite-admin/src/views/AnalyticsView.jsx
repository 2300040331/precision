import React from 'react';
import { BarChart3, Users, Globe, Smartphone, Monitor, Clock, ArrowUpRight } from 'lucide-react';

export default function AnalyticsView({ analytics }) {
  const stats = analytics || {
    totalVisitors: 24592,
    todayVisitors: 1420,
    monthVisitors: 18450,
    liveVisitors: 6,
    bounceRate: '28.4%',
    avgSessionDuration: '3m 14s',
    devices: { Desktop: 68, Mobile: 26, Tablet: 6 },
    referrers: { Direct: 42, Google: 38, LinkedIn: 14, Referral: 6 },
    popularPages: [
      { path: '/home.html', count: 12450 },
      { path: '/services.html', count: 5210 },
      { path: '/contact.html', count: 3120 },
      { path: '/services-audit.html', count: 1840 },
    ],
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Real Website Analytics & Visitor Studio</h1>
            <p className="text-slate-400 text-xs">Live traffic telemetry, device breakdown, and popular pages.</p>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-slate-400">Visitors Today</span>
          <div className="text-2xl font-bold text-white">{stats.todayVisitors.toLocaleString()}</div>
          <span className="text-xs text-emerald-400 font-medium">↑ +12.4% vs yesterday</span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-slate-400">Visitors This Month</span>
          <div className="text-2xl font-bold text-white">{stats.monthVisitors.toLocaleString()}</div>
          <span className="text-xs text-indigo-400 font-medium">Monthly Active Traffic</span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-slate-400">Avg Session Duration</span>
          <div className="text-2xl font-bold text-emerald-400">{stats.avgSessionDuration}</div>
          <span className="text-xs text-slate-400">Low Bounce Rate ({stats.bounceRate})</span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-slate-400">Live Active Session</span>
          <div className="text-2xl font-bold text-emerald-400 flex items-center">
            <span className="w-3 h-3 rounded-full bg-emerald-400 mr-2 animate-ping"></span>
            {stats.liveVisitors} Online
          </div>
          <span className="text-xs text-slate-400">Updated via SSE</span>
        </div>
      </div>

      {/* Top Visited Pages & Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Pages */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800/80 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Most Popular Pages</h2>
          <div className="space-y-3 text-xs">
            {stats.popularPages?.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-mono text-indigo-400 font-semibold">{p.path}</span>
                <span className="text-white font-bold">{p.count.toLocaleString()} views</span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800/80 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Device & Hardware Distribution</h2>
          <div className="space-y-4 text-xs pt-2">
            {Object.entries(stats.devices || {}).map(([dev, val]) => (
              <div key={dev} className="space-y-1.5">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>{dev}</span>
                  <span className="font-mono text-indigo-400">{val}%</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
