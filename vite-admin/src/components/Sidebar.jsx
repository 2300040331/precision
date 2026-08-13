import React, { useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  Briefcase,
  Building2,
  Image as ImageIcon,
  CalendarCheck,
  Inbox,
  BarChart3,
  Settings,
  Users,
  Activity,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Globe,
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  TrendingUp,
  Coins,
  PieChart,
  Building,
  FileText,
  Laptop,
  Landmark,
  Stethoscope,
  ShoppingCart,
  GraduationCap,
  Hotel,
  Zap,
  Truck,
  Rocket,
  HeartHandshake,
  Award,
  Mail,
  Plus,
  Palette,
} from 'lucide-react';

const getPublicSiteUrl = (path = '/home.html') => {
  if (typeof window !== 'undefined' && window.location) {
    return `${window.location.origin}${path}`;
  }
  return path;
};

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, user, onLogout, realtimeConnected, onAddCustomPage }) {
  const [servicesOpen, setServicesOpen] = useState(true);
  const [industriesOpen, setIndustriesOpen] = useState(true);

  // ALL 12 SERVICES MATCHING MAIN WEBSITE DROPDOWN
  const servicesList = [
    { id: 'service-1', label: 'Audit & Assurance', icon: ShieldCheck },
    { id: 'service-2', label: 'Taxation', icon: FileSpreadsheet },
    { id: 'service-3', label: 'Business Advisory', icon: TrendingUp },
    { id: 'service-4', label: 'Virtual CFO', icon: TrendingUp },
    { id: 'service-5', label: 'Accounting & Bookkeeping', icon: FileText },
    { id: 'service-6', label: 'Company Law & ROC', icon: Building },
    { id: 'service-7', label: 'Startup Advisory', icon: Sparkles },
    { id: 'service-8', label: 'Regulatory Compliance', icon: ShieldCheck },
    { id: 'service-9', label: 'Transaction Advisory', icon: PieChart },
    { id: 'service-10', label: 'Risk Advisory', icon: ShieldCheck },
    { id: 'service-11', label: 'Valuation', icon: PieChart },
    { id: 'service-12', label: 'Wealth Advisory', icon: Coins },
  ];

  // ALL 15 INDUSTRIES MATCHING MAIN WEBSITE DROPDOWN
  const industriesList = [
    { id: 'industry-1', label: 'Manufacturing', icon: Building2 },
    { id: 'industry-2', label: 'Technology', icon: Laptop },
    { id: 'industry-3', label: 'Healthcare', icon: Stethoscope },
    { id: 'industry-4', label: 'Banking & Finance', icon: Landmark },
    { id: 'industry-5', label: 'Real Estate', icon: Building2 },
    { id: 'industry-6', label: 'Retail & E-Commerce', icon: ShoppingCart },
    { id: 'industry-7', label: 'Education', icon: GraduationCap },
    { id: 'industry-8', label: 'Hospitality', icon: Hotel },
    { id: 'industry-9', label: 'Energy', icon: Zap },
    { id: 'industry-10', label: 'Logistics', icon: Truck },
    { id: 'industry-11', label: 'Government', icon: Landmark },
    { id: 'industry-12', label: 'Startups', icon: Rocket },
    { id: 'industry-13', label: 'Infrastructure', icon: Building2 },
    { id: 'industry-14', label: 'NGOs', icon: HeartHandshake },
    { id: 'industry-15', label: 'Global Business', icon: Globe },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 bg-[#071322] text-slate-300 border-r border-[#c8a45e]/20 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header with Logo */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-[#c8a45e]/20 bg-[#071322]/80 backdrop-blur-md">
        <div className="flex items-center space-x-3 overflow-hidden">
          {collapsed ? (
            <div className="w-10 h-10 rounded-xl bg-[#0f1d32] border border-[#c8a45e]/40 p-1 flex items-center justify-center shrink-0 shadow-lg">
              <img src="/assets/images/logo.png" alt="Precision & Co Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="flex items-center">
              <img src="/assets/images/logo.png" alt="Precision & Co. Logo" className="h-10 object-contain max-w-[180px]" />
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-[#c8a45e] hover:text-white hover:bg-[#0f1d32] border border-transparent hover:border-[#c8a45e]/30 transition-all shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-[#0f1d32]">
        {/* OVERVIEW */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold text-[#c8a45e] uppercase tracking-widest mb-2 opacity-90">OVERVIEW</p>
          )}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-[#c8a45e] to-[#a8863e] text-[#071322] font-bold shadow-lg shadow-[#c8a45e]/20 border border-[#e0c580]/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0f1d32]'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'} ${activeTab === 'dashboard' ? 'text-[#071322]' : 'text-[#c8a45e]'}`} />
            {!collapsed && <span className="flex-1 text-left truncate">Executive Dashboard</span>}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-[#c8a45e] to-[#a8863e] text-[#071322] font-bold shadow-lg shadow-[#c8a45e]/20 border border-[#e0c580]/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0f1d32]'
            }`}
          >
            <BarChart3 className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'} ${activeTab === 'analytics' ? 'text-[#071322]' : 'text-[#c8a45e]'}`} />
            {!collapsed && (
              <>
                <span className="flex-1 text-left truncate">Real Analytics</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Live</span>
              </>
            )}
          </button>
        </div>

        {/* WEBSITE PAGES & CMS */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold text-[#c8a45e] uppercase tracking-widest mb-2 opacity-90">WEBSITE PAGES (CMS)</p>
          )}
          <button
            onClick={() => setActiveTab('builder')}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'builder' || activeTab.startsWith('page-')
                ? 'bg-gradient-to-r from-[#c8a45e] to-[#a8863e] text-[#071322] font-bold shadow-lg shadow-[#c8a45e]/20 border border-[#e0c580]/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0f1d32]'
            }`}
          >
            <Layers className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'} ${activeTab === 'builder' || activeTab.startsWith('page-') ? 'text-[#071322]' : 'text-[#c8a45e]'}`} />
            {!collapsed && <span className="flex-1 text-left truncate">Home Page Builder</span>}
          </button>

          <button
            onClick={() => setActiveTab('live-editor')}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'live-editor'
                ? 'bg-gradient-to-r from-[#c8a45e] to-[#a8863e] text-[#071322] font-bold shadow-lg shadow-[#c8a45e]/20 border border-[#e0c580]/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0f1d32]'
            }`}
          >
            <Sparkles className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'} ${activeTab === 'live-editor' ? 'text-[#071322]' : 'text-[#c8a45e]'}`} />
            {!collapsed && <span className="flex-1 text-left truncate">Live Visual Editor</span>}
          </button>

          <button
            onClick={() => setActiveTab('experts')}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'experts'
                ? 'bg-gradient-to-r from-[#c8a45e] to-[#a8863e] text-[#071322] font-bold shadow-lg shadow-[#c8a45e]/20 border border-[#e0c580]/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0f1d32]'
            }`}
          >
            <Users className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'} ${activeTab === 'experts' ? 'text-[#071322]' : 'text-[#c8a45e]'}`} />
            {!collapsed && <span className="flex-1 text-left truncate">Our Experts Manager</span>}
          </button>

          <button
            onClick={() => setActiveTab('why-choose-us')}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'why-choose-us'
                ? 'bg-gradient-to-r from-[#c8a45e] to-[#a8863e] text-[#071322] font-bold shadow-lg shadow-[#c8a45e]/20 border border-[#e0c580]/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0f1d32]'
            }`}
          >
            <Award className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'} ${activeTab === 'why-choose-us' ? 'text-[#071322]' : 'text-[#c8a45e]'}`} />
            {!collapsed && <span className="flex-1 text-left truncate">Why Choose Us Manager</span>}
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'contact'
                ? 'bg-gradient-to-r from-[#c8a45e] to-[#a8863e] text-[#071322] font-bold shadow-lg shadow-[#c8a45e]/20 border border-[#e0c580]/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0f1d32]'
            }`}
          >
            <Mail className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'} ${activeTab === 'contact' ? 'text-[#071322]' : 'text-[#c8a45e]'}`} />
            {!collapsed && <span className="flex-1 text-left truncate">Contact Us Manager</span>}
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'media'
                ? 'bg-gradient-to-r from-[#c8a45e] to-[#a8863e] text-[#071322] font-bold shadow-lg shadow-[#c8a45e]/20 border border-[#e0c580]/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0f1d32]'
            }`}
          >
            <ImageIcon className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'} ${activeTab === 'media' ? 'text-[#071322]' : 'text-[#c8a45e]'}`} />
            {!collapsed && <span className="flex-1 text-left truncate">Media Library</span>}
          </button>
        </div>

        {/* THEME & DESIGN */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold text-[#c8a45e] uppercase tracking-widest mb-2 opacity-90">THEME & DESIGN</p>
          )}
          <button
            onClick={() => setActiveTab('theme-customization')}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'theme-customization'
                ? 'bg-gradient-to-r from-[#c8a45e] to-[#a8863e] text-[#071322] font-bold shadow-lg shadow-[#c8a45e]/20 border border-[#e0c580]/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0f1d32]'
            }`}
          >
            <Palette className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'} ${activeTab === 'theme-customization' ? 'text-[#071322]' : 'text-[#c8a45e]'}`} />
            {!collapsed && (
              <>
                <span className="flex-1 text-left truncate">Website Customization</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase bg-[#c8a45e]/20 text-[#e0c580] border border-[#c8a45e]/30">New</span>
              </>
            )}
          </button>

          {!collapsed && (
            <button
              onClick={() => {
                const title = prompt('Enter New Page Title (e.g. Careers, Privacy Policy, CSR):');
                if (!title) return;
                const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                if (onAddCustomPage) {
                  onAddCustomPage(title, slug);
                }
              }}
              className="w-full flex items-center justify-center px-3 py-2 rounded-xl text-xs font-extrabold text-[#c8a45e] hover:text-white bg-[#0f1d32] hover:bg-[#152540] border border-[#c8a45e]/40 transition-all mt-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>+ Add Custom Page</span>
            </button>
          )}
        </div>

        {/* PRACTICE MANAGEMENT */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold text-[#c8a45e] uppercase tracking-widest mb-2 opacity-90">PRACTICE MANAGEMENT</p>
          )}
          
          {/* Services Manager Group */}
          <div>
            <button
              onClick={() => {
                setActiveTab('services');
                setServicesOpen(!servicesOpen);
              }}
              className={`w-full flex items-center px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                activeTab === 'services' || activeTab.startsWith('service-')
                  ? 'bg-gradient-to-r from-[#c8a45e] to-[#a8863e] text-[#071322] font-bold border border-[#e0c580]/40'
                  : 'text-slate-300 hover:text-white hover:bg-[#0f1d32]'
              }`}
            >
              <Briefcase className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'} ${activeTab.includes('service') ? 'text-[#071322]' : 'text-[#c8a45e]'}`} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left truncate">Services Manager ({servicesList.length})</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            {!collapsed && servicesOpen && (
              <div className="ml-4 pl-2 border-l border-[#c8a45e]/20 space-y-1 mt-1 max-h-48 overflow-y-auto scrollbar-thin">
                {servicesList.map(s => {
                  const SIcon = s.icon;
                  const isSubActive = activeTab === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveTab(s.id)}
                      className={`w-full flex items-center px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                        isSubActive
                          ? 'bg-[#c8a45e]/20 text-[#c8a45e] font-bold border border-[#c8a45e]/30'
                          : 'text-slate-400 hover:text-white hover:bg-[#0f1d32]'
                      }`}
                    >
                      <SIcon className="w-3 h-3 mr-2 text-[#c8a45e] shrink-0" />
                      <span className="truncate">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Industries Manager Group */}
          <div className="pt-1">
            <button
              onClick={() => {
                setActiveTab('industries');
                setIndustriesOpen(!industriesOpen);
              }}
              className={`w-full flex items-center px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                activeTab === 'industries' || activeTab.startsWith('industry-')
                  ? 'bg-gradient-to-r from-[#c8a45e] to-[#a8863e] text-[#071322] font-bold border border-[#e0c580]/40'
                  : 'text-slate-300 hover:text-white hover:bg-[#0f1d32]'
              }`}
            >
              <Building2 className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'} ${activeTab.includes('industry') ? 'text-[#071322]' : 'text-[#c8a45e]'}`} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left truncate">Industries Manager ({industriesList.length})</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${industriesOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            {!collapsed && industriesOpen && (
              <div className="ml-4 pl-2 border-l border-[#c8a45e]/20 space-y-1 mt-1 max-h-48 overflow-y-auto scrollbar-thin">
                {industriesList.map(ind => {
                  const IndIcon = ind.icon;
                  const isIndActive = activeTab === ind.id;
                  return (
                    <button
                      key={ind.id}
                      onClick={() => setActiveTab(ind.id)}
                      className={`w-full flex items-center px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                        isIndActive
                          ? 'bg-[#c8a45e]/20 text-[#c8a45e] font-bold border border-[#c8a45e]/30'
                          : 'text-slate-400 hover:text-white hover:bg-[#0f1d32]'
                      }`}
                    >
                      <IndIcon className="w-3 h-3 mr-2 text-[#c8a45e] shrink-0" />
                      <span className="truncate">{ind.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* LEADS & MESSAGES */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold text-[#c8a45e] uppercase tracking-widest mb-2 opacity-90">LEADS & MESSAGES</p>
          )}
          <button
            onClick={() => setActiveTab('consultations')}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'consultations'
                ? 'bg-gradient-to-r from-[#c8a45e] to-[#a8863e] text-[#071322] font-bold shadow-lg shadow-[#c8a45e]/20 border border-[#e0c580]/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0f1d32]'
            }`}
          >
            <CalendarCheck className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'} ${activeTab === 'consultations' ? 'text-[#071322]' : 'text-[#c8a45e]'}`} />
            {!collapsed && <span className="flex-1 text-left truncate">Consultations CRM</span>}
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'inbox'
                ? 'bg-gradient-to-r from-[#c8a45e] to-[#a8863e] text-[#071322] font-bold shadow-lg shadow-[#c8a45e]/20 border border-[#e0c580]/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0f1d32]'
            }`}
          >
            <Inbox className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'} ${activeTab === 'inbox' ? 'text-[#071322]' : 'text-[#c8a45e]'}`} />
            {!collapsed && <span className="flex-1 text-left truncate">Contact Inbox</span>}
          </button>
        </div>

        {/* ADMIN & SECURITY */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold text-[#c8a45e] uppercase tracking-widest mb-2 opacity-90">ADMIN & SECURITY</p>
          )}
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-[#c8a45e] to-[#a8863e] text-[#071322] font-bold shadow-lg shadow-[#c8a45e]/20 border border-[#e0c580]/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0f1d32]'
            }`}
          >
            <Settings className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'} ${activeTab === 'settings' ? 'text-[#071322]' : 'text-[#c8a45e]'}`} />
            {!collapsed && <span className="flex-1 text-left truncate">Website Settings & SEO</span>}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-[#c8a45e] to-[#a8863e] text-[#071322] font-bold shadow-lg shadow-[#c8a45e]/20 border border-[#e0c580]/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0f1d32]'
            }`}
          >
            <Users className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'} ${activeTab === 'users' ? 'text-[#071322]' : 'text-[#c8a45e]'}`} />
            {!collapsed && <span className="flex-1 text-left truncate">Users & Roles</span>}
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'system'
                ? 'bg-gradient-to-r from-[#c8a45e] to-[#a8863e] text-[#071322] font-bold shadow-lg shadow-[#c8a45e]/20 border border-[#e0c580]/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0f1d32]'
            }`}
          >
            <Activity className={`w-4 h-4 shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'} ${activeTab === 'system' ? 'text-[#071322]' : 'text-[#c8a45e]'}`} />
            {!collapsed && <span className="flex-1 text-left truncate">System & Audit Logs</span>}
          </button>
        </div>
      </div>

      {/* Footer & User Profile */}
      <div className="p-3 border-t border-[#c8a45e]/20 bg-[#071322] space-y-2">
        <a
          href={getPublicSiteUrl('/home.html')}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center px-3 py-2 text-[#c8a45e] hover:bg-[#0f1d32] rounded-xl text-xs font-semibold transition-all border border-[#c8a45e]/30"
        >
          <Globe className={`w-4 h-4 ${collapsed ? '' : 'mr-2'}`} />
          {!collapsed && <span>View Public Website</span>}
        </a>

        <div className="flex items-center justify-between p-2 rounded-xl bg-[#0f1d32] border border-[#c8a45e]/20">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c8a45e] to-[#a8863e] flex items-center justify-center font-bold text-[#071322] text-xs shrink-0 shadow-md">
              {user?.name ? user.name[0] : 'A'}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate">{user?.name || 'Super Admin'}</span>
                <span className="text-[10px] text-[#c8a45e] truncate font-mono">{user?.role || 'SUPER_ADMIN'}</span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
