import React, { useState, useEffect } from 'react';
import { Search, Bell, Globe, ShieldCheck, Command } from 'lucide-react';

const getPublicSiteUrl = (path = '/home.html') => {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    if (window.location.hostname.includes('vercel.app')) {
      return `https://precision-henna.vercel.app${path}`;
    }
    return `http://${window.location.hostname}:5001${path}`;
  }
  return `https://precision-henna.vercel.app${path}`;
};

export default function Header({ collapsed, onOpenSearch, notifications, onClearNotifications, user }) {
  const [time, setTime] = useState('');
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header
      className={`h-20 bg-[#071322]/90 backdrop-blur-md border-b border-[#c8a45e]/20 sticky top-0 z-20 flex items-center justify-between px-6 transition-all duration-300 ${
        collapsed ? 'ml-20' : 'ml-64'
      }`}
    >
      {/* Global Search Trigger */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onOpenSearch}
          className="flex items-center bg-[#0f1d32] border border-[#c8a45e]/30 hover:border-[#c8a45e] rounded-xl px-4 py-2 w-80 text-slate-300 hover:text-white transition-all text-xs shadow-inner group"
        >
          <Search className="w-4 h-4 text-[#c8a45e] group-hover:scale-110 transition-transform mr-2.5" />
          <span className="flex-1 text-left">Search pages, services, leads...</span>
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[#c8a45e] bg-[#071322] rounded border border-[#c8a45e]/30">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Live Clock & DB Status */}
        <div className="hidden lg:flex items-center space-x-3 text-xs border-r border-[#c8a45e]/20 pr-4">
          <div className="flex items-center text-[#c8a45e] font-mono bg-[#0f1d32] px-3 py-1.5 rounded-xl border border-[#c8a45e]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></span>
            {time || '17:58:00'}
          </div>
          <div className="flex items-center text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-medium">
            <ShieldCheck className="w-4 h-4 mr-1.5" /> CMS Active
          </div>
        </div>

        {/* Real-time Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDrawer(!showNotifDrawer)}
            className="p-2 text-slate-300 hover:text-white hover:bg-[#0f1d32] rounded-xl transition-colors relative border border-transparent hover:border-[#c8a45e]/30"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-[#c8a45e]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c8a45e] rounded-full ring-4 ring-[#071322] animate-ping"></span>
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c8a45e] rounded-full"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDrawer && (
            <div className="absolute right-0 mt-2 w-80 bg-[#071322] border border-[#c8a45e]/30 rounded-2xl shadow-2xl z-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#c8a45e]/20 pb-2">
                <span className="text-xs font-bold text-[#c8a45e] uppercase tracking-wider">Notifications ({notifications.length})</span>
                {notifications.length > 0 && (
                  <button onClick={onClearNotifications} className="text-[10px] text-slate-400 hover:text-[#c8a45e]">Clear all</button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2 text-xs">
                {notifications.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No new notifications</p>
                ) : (
                  notifications.map((n, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#0f1d32] border border-[#c8a45e]/20 space-y-1">
                      <div className="flex items-center justify-between text-[#c8a45e] font-semibold">
                        <span>{n.title}</span>
                        <span className="text-[9px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-slate-200 text-[11px] leading-tight">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Public Site Button */}
        <a
          href={getPublicSiteUrl('/home.html')}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-[#c8a45e] to-[#a8863e] hover:from-[#d4b46f] hover:to-[#c8a45e] text-[#071322] rounded-xl text-xs font-extrabold shadow-lg shadow-[#c8a45e]/20 transition-all border border-[#e0c580]/40"
        >
          <Globe className="w-4 h-4" />
          <span>Live Website</span>
        </a>
      </div>
    </header>
  );
}
