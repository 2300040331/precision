import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GlobalSearchModal from './components/GlobalSearchModal';
import BookConsultationModal from './components/BookConsultationModal';

import DashboardView from './views/DashboardView';
import PageBuilderView from './views/PageBuilderView';
import LiveVisualEditor from './views/LiveVisualEditor';
import ServicesView from './views/ServicesView';
import IndustriesView from './views/IndustriesView';
import MediaLibraryView from './views/MediaLibraryView';
import ConsultationsView from './views/ConsultationsView';
import ContactInboxView from './views/ContactInboxView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';
import UsersView from './views/UsersView';
import ExpertsView from './views/ExpertsView';
import WhyChooseUsView from './views/WhyChooseUsView';
import ContactUsView from './views/ContactUsView';
import SystemView from './views/SystemView';
import { api, fullWebsiteStore } from './services/api';
import { ShieldCheck, ArrowRight } from 'lucide-react';



export default function App() {
  return <MainApp />;
}

function MainApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState(fullWebsiteStore.user);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('services');
  const [collapsed, setCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(false);

  // Data States pre-populated with full website data
  const [pages, setPages] = useState(fullWebsiteStore.pages || []);
  const [services, setServices] = useState(fullWebsiteStore.services || []);
  const [industries, setIndustries] = useState(fullWebsiteStore.industries || []);
  const [media, setMedia] = useState(fullWebsiteStore.media || []);
  const [consultations, setConsultations] = useState(fullWebsiteStore.consultations || []);
  const [contacts, setContacts] = useState(fullWebsiteStore.contacts || []);
  const [analytics, setAnalytics] = useState(fullWebsiteStore.analytics || {});
  const [settings, setSettings] = useState(fullWebsiteStore.settings || {});
  const [users, setUsers] = useState(fullWebsiteStore.users || []);
  const [systemHealth, setSystemHealth] = useState(fullWebsiteStore.systemHealth || {});
  const [auditLogs, setAuditLogs] = useState(fullWebsiteStore.auditLogs || []);
  const [experts, setExperts] = useState(fullWebsiteStore.experts || []);
  const [expertsHeader, setExpertsHeader] = useState(fullWebsiteStore.expertsHeader || { title: 'Our Experts', subtitle: 'The best industry experts will share their experience and talk about their projects.' });
  const [whyChooseUs, setWhyChooseUs] = useState(fullWebsiteStore.whyChooseUs || {});
  const [contactUs, setContactUs] = useState(fullWebsiteStore.contactUs || {});

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to Enterprise CMS', message: 'Connected to live database.', time: 'Just now', read: false },
  ]);

  // Authentication is intentionally in-memory. Content never uses browser storage.
  useEffect(() => {
    setIsAuthenticated(true);
  }, []);

  // Fetch All Data when authenticated
  const loadAllData = async () => {
    try {
      await api.syncRemoteStore();
      const [pData, sData, iData, mData, cData, ctData, aData, settData, uData, sysData, logData, expData, whyData, cuData] = await Promise.all([
        api.getPages(),
        api.getServices(),
        api.getIndustries(),
        api.getMedia(),
        api.getConsultations(),
        api.getContacts(),
        api.getAnalyticsStats(),
        api.getSettings(),
        api.getUsers(),
        api.getSystemHealth(),
        api.getAuditLogs(),
        api.getExperts(),
        api.getWhyChooseUs(),
        api.getContactUs(),
      ]);

      setPages(pData);
      setServices(sData);
      setIndustries(iData);
      setMedia(mData);
      setConsultations(cData);
      setContacts(ctData);
      setAnalytics(aData);
      setSettings(settData);
      setUsers(uData);
      setSystemHealth(sysData);
      setAuditLogs(logData);
      if (expData) {
        if (expData.list) setExperts(expData.list);
        if (expData.header) setExpertsHeader(expData.header);
      }
      if (whyData) setWhyChooseUs(whyData);
      if (cuData) setContactUs(cuData);
    } catch (err) {
      console.error('Data load error:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
      setupSSE();
    }
  }, [isAuthenticated]);

  // Real-time SSE Stream Listener
  const setupSSE = () => {
    try {
      if (typeof window === 'undefined') return;
      if (window.location.protocol === 'https:' || window.location.hostname.includes('vercel.app')) {
        setRealtimeConnected(true);
        return;
      }
      const host = window.location.hostname || 'localhost';
      const eventSource = new EventSource(`http://${host}:5001/api/events/stream`);

      eventSource.onopen = () => {
        setRealtimeConnected(true);
      };

      eventSource.onerror = () => {
        setRealtimeConnected(false);
        eventSource.close();
      };

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'NEW_CONSULTATION') {
            setConsultations(prev => [payload.data, ...prev]);
          } else if (payload.type === 'NEW_CONTACT_MESSAGE') {
            setContacts(prev => [payload.data, ...prev]);
          }
        } catch (e) {}
      };

      return () => {
        eventSource.close();
      };
    } catch (e) {
      setRealtimeConnected(true);
    }
  };

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const cleanEmail = (loginEmail || '').trim();
    const cleanPassword = (loginPassword || '').trim();
    if (!cleanEmail || !cleanPassword) {
      setLoginError('Please enter both admin email and password.');
      return;
    }
    setLoginLoading(true);
    try {
      const data = await api.login(cleanEmail, cleanPassword);
      if (data && (data.token || data.user)) {
        if (data.token) {
          api.setToken(data.token);
        }
        setUser(data.user || fullWebsiteStore.user);
        setActiveTab('dashboard');
        setIsAuthenticated(true);
      } else {
        setLoginError('Invalid email or password. Access denied.');
        setIsAuthenticated(false);
      }
    } catch (err) {
      setLoginError(err.message || 'Invalid email or password. Access denied.');
      setIsAuthenticated(false);
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    api.setToken('');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Keyboard shortcut Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for child views
  const handleSaveSection = async (sectionId, sectionData) => {
    await api.updateSection(sectionId, sectionData);
    await loadAllData();
  };

  const handleAddSection = async (pageId, sectionData) => {
    await api.addSection(pageId, sectionData);
    await loadAllData();
  };

  const handleDeleteSection = async (sectionId) => {
    await api.deleteSection(sectionId);
    await loadAllData();
  };

  const handleReorderSections = async (pageId, sectionIds) => {
    await api.reorderSections(pageId, sectionIds);
    await loadAllData();
  };

  const handlePublishPage = async (pageId) => {
    await api.publishPage(pageId);
    await loadAllData();
    alert(`Page "${pageId}" changes published live to production website!`);
  };

  // Experts Handlers
  const handleSaveExperts = async (updatedList, updatedHeader) => {
    if (Array.isArray(updatedList)) setExperts(updatedList);
    if (updatedHeader) setExpertsHeader(updatedHeader);
    await api.updateExperts(updatedList, updatedHeader);
  };

  // Why Choose Us Handler
  const handleSaveWhyChooseUs = async (formData) => {
    await api.updateWhyChooseUs(formData);
    await loadAllData();
  };

  // Contact Us Handler
  const handleSaveContactUs = async (formData) => {
    await api.updateContactUs(formData);
    await loadAllData();
  };

  // Services Handlers
  const handleCreateService = async (data) => {
    await api.createService(data);
    await loadAllData();
  };

  const handleUpdateService = async (id, data) => {
    await api.updateService(id, data);
    await loadAllData();
  };

  const handleDuplicateService = async (id) => {
    await api.duplicateService(id);
    await loadAllData();
  };

  const handleDeleteService = async (id) => {
    if (confirm('Delete this service?')) {
      await api.deleteService(id);
      await loadAllData();
    }
  };

  // Industries Handlers
  const handleCreateIndustry = async (data) => {
    await api.createIndustry(data);
    await loadAllData();
  };

  const handleUpdateIndustry = async (id, data) => {
    await api.updateIndustry(id, data);
    await loadAllData();
  };

  const handleDeleteIndustry = async (id) => {
    if (confirm('Delete this industry?')) {
      await api.deleteIndustry(id);
      await loadAllData();
    }
  };

  // Media Handlers
  const handleUploadMedia = async (formData) => {
    await api.uploadMedia(formData);
    await loadAllData();
  };

  const handleUpdateMedia = async (id, data) => {
    await api.updateMedia(id, data);
    await loadAllData();
  };

  const handleDeleteMedia = async (id) => {
    await api.deleteMedia(id);
    await loadAllData();
  };

  // Consultation Handlers
  const handleAddConsultation = async (newLead) => {
    setConsultations(prev => [newLead, ...prev]);
    try {
      await api.createConsultation(newLead);
      await loadAllData();
    } catch (e) {
      // Local state already updated
    }
  };

  const handleUpdateConsultationStatus = async (id, data) => {
    await api.updateConsultation(id, data);
    await loadAllData();
  };

  // Contact Handlers
  const handleUpdateContactStatus = async (id, data) => {
    await api.updateContact(id, data);
    await loadAllData();
  };

  const handleDeleteContact = async (id) => {
    await api.deleteContact(id);
    await loadAllData();
  };

  // Settings Handler
  const handleSaveSettings = async (data) => {
    await api.updateSettings(data);
    await loadAllData();
  };

  // Users Handlers
  const handleCreateUser = async (data) => {
    await api.createUser(data);
    await loadAllData();
  };

  const handleDeleteUser = async (id) => {
    await api.deleteUser(id);
    await loadAllData();
  };

  // If not authenticated, show Enterprise Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#071322] flex items-center justify-center p-4 font-sans text-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#c8a45e]/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="bg-[#0f1d32]/90 border border-[#c8a45e]/30 w-full max-w-md rounded-3xl p-8 shadow-2xl space-y-6 relative z-10 backdrop-blur-xl">
          <div className="text-center space-y-3">
            <img src="logo.png" onError={(e) => { e.target.src = '/assets/images/logo.png'; }} alt="Precision & Co Logo" className="h-16 mx-auto object-contain" />
            <h1 className="text-lg font-bold text-white tracking-wider uppercase">ENTERPRISE CMS PORTAL</h1>
            <div className="h-0.5 w-16 bg-[#c8a45e] mx-auto rounded-full"></div>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-[#c8a45e] font-semibold">Admin Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-[#071322] border border-[#c8a45e]/30 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#c8a45e]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[#c8a45e] font-semibold">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-[#071322] border border-[#c8a45e]/30 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#c8a45e]"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-gradient-to-r from-[#c8a45e] to-[#a8863e] hover:from-[#d4b46f] hover:to-[#c8a45e] text-[#071322] font-extrabold rounded-xl shadow-lg shadow-[#c8a45e]/20 transition-all flex items-center justify-center text-xs tracking-wider uppercase border border-[#e0c580]/40"
            >
              <span>{loginLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Authenticated CMS Layout
  const handleResetPageSections = async (pageId) => {
    const updatedStore = await api.resetPageSections(pageId);
    if (updatedStore && updatedStore.pages) {
      setPages([...updatedStore.pages]);
    }
  };

  const handleAddCustomPage = async (title, slug) => {
    const newPage = {
      id: slug || `page-${Date.now()}`,
      title: title,
      slug: slug || `page-${Date.now()}`,
      metaTitle: `${title} | Precision & Co.`,
      metaDesc: `Official ${title} page for Precision & Co.`,
      sections: [
        {
          id: `sec-${Date.now()}`,
          name: `${title} Hero Section`,
          type: 'hero',
          visible: true,
          order: 1,
          content: JSON.stringify({
            title: title,
            subtitle: 'PRECISION & CO.',
            description: `Welcome to the ${title} page.`,
          }),
        },
      ],
    };
    const store = api.getStore();
    store.pages = [...(store.pages || []), newPage];
    await api.saveStore(store);
    await loadAllData();
    setActiveTab('builder');
    alert(`New Custom Page "${title}" created! You can now add, edit, or reorder sections for this page.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        user={user}
        onLogout={handleLogout}
        realtimeConnected={realtimeConnected}
        onAddCustomPage={handleAddCustomPage}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          collapsed={collapsed}
          onOpenSearch={() => setIsSearchOpen(true)}
          notifications={notifications}
          onClearNotifications={() => setNotifications([])}
          user={user}
          onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
        />

        <main className={`flex-1 p-6 md:p-8 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
          {activeTab === 'dashboard' && (
            <DashboardView
              analytics={analytics}
              consultations={consultations}
              services={services}
              systemHealth={systemHealth}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
            />
          )}

          {activeTab === 'builder' && (
            <PageBuilderView
              pages={pages}
              onSaveSection={handleSaveSection}
              onAddSection={handleAddSection}
              onDeleteSection={handleDeleteSection}
              onReorderSections={handleReorderSections}
              onPublishPage={handlePublishPage}
            />
          )}

          {activeTab === 'live-editor' && (
            <LiveVisualEditor pages={pages} onSaveSection={handleSaveSection} />
          )}

          {activeTab === 'experts' && (
            <ExpertsView
              experts={experts}
              pageHeader={expertsHeader}
              onSave={handleSaveExperts}
            />
          )}

          {activeTab === 'why-choose-us' && (
            <WhyChooseUsView
              initialData={whyChooseUs}
              onSave={handleSaveWhyChooseUs}
            />
          )}

          {activeTab === 'contact' && (
            <ContactUsView
              initialData={contactUs}
              onSave={handleSaveContactUs}
            />
          )}

          {(activeTab === 'services' || activeTab.startsWith('service-') || activeTab === 'products') && (
            <ServicesView
              services={services}
              selectedServiceId={activeTab.startsWith('service-') ? parseInt(activeTab.replace('service-', '')) : null}
              onCreate={handleCreateService}
              onUpdate={handleUpdateService}
              onDuplicate={handleDuplicateService}
              onDelete={handleDeleteService}
            />
          )}

          {(activeTab === 'industries' || activeTab.startsWith('industry-')) && (
            <IndustriesView
              industries={industries}
              selectedIndustryId={activeTab.startsWith('industry-') ? parseInt(activeTab.replace('industry-', '')) : null}
              onCreate={handleCreateIndustry}
              onUpdate={handleUpdateIndustry}
              onDelete={handleDeleteIndustry}
            />
          )}

          {activeTab === 'media' && (
            <MediaLibraryView
              media={media}
              onUpload={handleUploadMedia}
              onUpdate={handleUpdateMedia}
              onDelete={handleDeleteMedia}
            />
          )}

          {activeTab === 'consultations' && (
            <ConsultationsView
              consultations={consultations}
              onUpdateStatus={handleUpdateConsultationStatus}
              onDelete={(id) => loadAllData()}
            />
          )}

          {activeTab === 'inbox' && (
            <ContactInboxView
              contacts={contacts}
              onUpdateStatus={handleUpdateContactStatus}
              onDelete={handleDeleteContact}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsView analytics={analytics} />}

          {activeTab === 'settings' && (
            <SettingsView settings={settings} onSaveSettings={handleSaveSettings} />
          )}

          {activeTab === 'users' && (
            <UsersView
              users={users}
              onCreateUser={handleCreateUser}
              onUpdateUser={() => {}}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {activeTab === 'system' && (
            <SystemView systemHealth={systemHealth} auditLogs={auditLogs} />
          )}
        </main>
      </div>

      {/* Global Cmd+K Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        pages={pages}
        services={services}
        industries={industries}
        consultations={consultations}
        onNavigate={(tab, id) => setActiveTab(tab)}
      />

      {/* Book Consultation WhatsApp Modal */}
      <BookConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        onAddConsultation={handleAddConsultation}
        targetWhatsAppNumber={settings?.contactPhone || '919876543210'}
      />
    </div>
  );
}
