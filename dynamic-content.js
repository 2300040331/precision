// Precision & Co. Dynamic Content & Telemetry Sync Script
// Connects public frontend website dynamically to the Enterprise CMS Backend & Instant Storage

(function () {
  const getApiBase = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      if (window.location.hostname.includes('vercel.app')) {
        return '/api';
      }
      return `http://${window.location.hostname}:5001/api`;
    }
    return '/api';
  };

  const API_BASE = getApiBase();

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      let pageKey = window.location.pathname.split('/').pop().replace('.html', '');
      if (!pageKey || pageKey === 'index') pageKey = 'home';

      // 1. Send Visitor Telemetry
      trackVisitor();

      // 2. First apply instant local storage cache (for instantaneous reflection)
      refreshFromCache(pageKey);

      // Listen for real-time storage changes (cross-tab / cross-window CMS updates)
      window.addEventListener('storage', (e) => {
        if (e.key === 'precision_cms_content' || e.key === 'precision_cms_full_store') {
          refreshFromCache(pageKey);
        }
      });

      // 3. Fetch Latest Dynamic Content from CMS API for current page
      try {
        const res = await fetch(`/api/getContent?page=${pageKey}`);
        if (res.ok) {
          const pageData = await res.json();
          if (pageData && typeof pageData === 'object' && Object.keys(pageData).length > 0) {
            const flatData = extractPageFlatContent(pageData, pageKey);
            if (Object.keys(flatData).length > 0) {
              const currentCache = JSON.parse(localStorage.getItem('precision_cms_content') || '{}');
              const merged = { ...currentCache, ...flatData };
              applyContentBindings(merged);
              localStorage.setItem('precision_cms_content', JSON.stringify(merged));
            }
          }
        }
      } catch (err) {}

      // 4. Attach Consultation & Contact Form Listeners
      setupFormListeners();
    } catch (err) {
      console.warn('CMS dynamic sync warning (using cached/default content):', err);
    }
  });

  function refreshFromCache(pageKey) {
    const fullStoreStr = localStorage.getItem('precision_cms_full_store');
    if (fullStoreStr) {
      try {
        const fullStore = JSON.parse(fullStoreStr);
        const flatData = extractPageFlatContent(fullStore, pageKey);
        if (flatData && Object.keys(flatData).length > 0) {
          applyContentBindings(flatData);
          return;
        }
      } catch (e) {}
    }

    const cached = localStorage.getItem('precision_cms_content');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed[pageKey] && typeof parsed[pageKey] === 'object') {
          applyContentBindings(parsed[pageKey]);
        }
      } catch (e) {}
    }
  }

  // Extract content strictly belonging to the requested page or sections
  function extractPageFlatContent(raw, pageKey) {
    let flat = {};

    if (!raw) return flat;

    if (pageKey === 'contact' && (raw.contactUs || raw.contact)) {
      flat = { ...(raw.contactUs || raw.contact), ...flat };
    }
    if (pageKey === 'why-choose-us' && (raw.whyChooseUs || raw['why-choose-us'])) {
      flat = { ...(raw.whyChooseUs || raw['why-choose-us']), ...flat };
    }
    if (pageKey === 'experts' && (raw.experts || raw.expertsHeader)) {
      flat = { experts: raw.experts, expertsHeader: raw.expertsHeader, ...flat };
    }

    // Single page object returned for ?page=pageKey
    if (raw.sections && Array.isArray(raw.sections)) {
      raw.sections.forEach(sec => {
        if (sec && sec.content) {
          try {
            const parsed = typeof sec.content === 'string' ? JSON.parse(sec.content) : sec.content;
            if (sec.type === 'cta' || sec.id === 'sec-cta') {
              if (parsed.title) flat.ctaTitle = parsed.title;
              if (parsed.description) flat.ctaDescription = parsed.description;
            } else {
              flat = { ...parsed, ...flat };
            }
          } catch (e) {}
        }
      });
      return flat;
    }

    // Full store object containing pages array
    if (raw.pages && Array.isArray(raw.pages)) {
      const pageObj = raw.pages.find(p => p.id === pageKey || p.slug === pageKey);
      if (pageObj && Array.isArray(pageObj.sections)) {
        pageObj.sections.forEach(sec => {
          if (sec && sec.content) {
            try {
              const parsed = typeof sec.content === 'string' ? JSON.parse(sec.content) : sec.content;
              if (sec.type === 'cta' || sec.id === 'sec-cta') {
                if (parsed.title) flat.ctaTitle = parsed.title;
                if (parsed.description) flat.ctaDescription = parsed.description;
              } else {
                flat = { ...parsed, ...flat };
              }
            } catch (e) {}
          }
        });
      }
    }

    if (raw[pageKey] && typeof raw[pageKey] === 'object') {
      flat = { ...raw[pageKey], ...flat };
    }

    return flat;
  }

  // Enable Live Admin CMS Sync
  const FREEZE_MAIN_WEBSITE = false;

  // Apply content bindings for data-content attributes and dynamic page sections
  function applyContentBindings(data) {
    if (FREEZE_MAIN_WEBSITE) {
      return;
    }
    if (!data || typeof data !== 'object') return;

    // 1. Dynamic SEO & Meta Tags
    if (data.metaTitle) {
      document.title = data.metaTitle;
    }
    if (data.metaDesc) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', data.metaDesc);
    }
    if (data.keywords) {
      let metaKw = document.querySelector('meta[name="keywords"]');
      if (metaKw) metaKw.setAttribute('content', data.keywords);
    }

    // 2. Element Content & Attribute Bindings
    const elements = document.querySelectorAll('[data-content]');
    elements.forEach(el => {
      const key = el.getAttribute('data-content');
      if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
        if (el.tagName === 'IMG') {
          el.src = data[key];
        } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.value = data[key];
        } else if (el.tagName === 'A' && key.endsWith('Link')) {
          el.href = data[key];
        } else {
          el.innerHTML = data[key];
        }
      }
    });

    // 3. Experts Page Live Sync (experts.html or /experts)
    const isExpertsPage = window.location.pathname.includes('experts');
    if (isExpertsPage) {
      try {
        const fullStoreStr = localStorage.getItem('precision_cms_full_store');
        if (fullStoreStr) {
          const store = JSON.parse(fullStoreStr);
          updateExpertsPage(store.experts, store.expertsHeader);
        } else if (data.experts || data.expertsHeader) {
          updateExpertsPage(data.experts, data.expertsHeader);
        }
      } catch (e) {}
    }

    // 4. Why Choose Us Page Live Sync (why-choose-us.html or /why-choose-us)
    const isWhyPage = window.location.pathname.includes('why-choose-us');
    if (isWhyPage) {
      try {
        const fullStoreStr = localStorage.getItem('precision_cms_full_store');
        if (fullStoreStr) {
          const store = JSON.parse(fullStoreStr);
          const whyData = store.whyChooseUs;
          if (whyData) {
            const heroTitle = document.querySelector('.wcu-hero__title, .hero-title, h1');
            if (heroTitle && whyData.heroTitle) heroTitle.innerHTML = whyData.heroTitle;
            const heroDesc = document.querySelector('.wcu-hero__subtitle, .hero-desc, p.lead');
            if (heroDesc && whyData.heroDesc) heroDesc.innerHTML = whyData.heroDesc;
            const philBody = document.querySelector('.wcu-philosophy__text, .philosophy-body');
            if (philBody && whyData.philosophyBody) philBody.innerHTML = whyData.philosophyBody;
          }
        }
      } catch (e) {}
    }

    // 5. Contact Us Page Live Sync (contact.html or /contact)
    const isContactPage = window.location.pathname.includes('contact');
    if (isContactPage) {
      try {
        const fullStoreStr = localStorage.getItem('precision_cms_full_store');
        let cData = null;
        if (fullStoreStr) {
          const store = JSON.parse(fullStoreStr);
          cData = store.contactUs || store.contact;
        }
        if (!cData) cData = data;

        if (cData) {
          const phoneEl = document.querySelector('[data-content="primaryPhone"]');
          if (phoneEl && cData.primaryPhone) phoneEl.textContent = cData.primaryPhone;
          const secPhoneEl = document.querySelector('[data-content="secondaryPhone"]');
          if (secPhoneEl && cData.secondaryPhone) secPhoneEl.textContent = cData.secondaryPhone;
          const emailEl = document.querySelector('[data-content="email"]');
          if (emailEl && cData.email) emailEl.textContent = cData.email;
          const taxEmailEl = document.querySelector('[data-content="taxEmail"]');
          if (taxEmailEl && cData.taxEmail) taxEmailEl.textContent = cData.taxEmail;
          const hqEl = document.querySelector('[data-content="headquarters"]');
          if (hqEl && cData.headquarters) hqEl.textContent = cData.headquarters;
        }
      } catch (e) {}
    }
  }

  function updateExpertsPage(experts, expertsHeader) {
    if (expertsHeader) {
      const h1 = document.querySelector('.founders-title');
      if (h1 && expertsHeader.title) h1.textContent = expertsHeader.title;
      const sub = document.querySelector('.founders-subtitle');
      if (sub && expertsHeader.subtitle) sub.textContent = expertsHeader.subtitle;
    }

    if (!Array.isArray(experts) || experts.length === 0) return;

    const cards = document.querySelectorAll('.founder-card');
    cards.forEach((card, idx) => {
      const exp = experts[idx];
      if (!exp) return;

      // Update Card Image
      const cardImg = card.querySelector('.fcard-img-wrapper img');
      if (cardImg && exp.image) {
        cardImg.src = exp.image;
      }

      // Update Card Text
      const nameEl = card.querySelector('.fcard-name');
      if (nameEl && exp.name) nameEl.textContent = exp.name;

      const roleEl = card.querySelector('.fcard-role');
      if (roleEl && exp.role) roleEl.textContent = exp.role;

      const qualEl = card.querySelector('.fcard-qual');
      if (qualEl && exp.qualifications) qualEl.textContent = exp.qualifications;

      // Update corresponding Modal Image and Text
      const modalId = card.getAttribute('data-founder') || (idx + 1);
      const modal = document.getElementById(`modal-${modalId}`) || document.querySelectorAll('.founder-modal')[idx];
      if (modal) {
        const modalImg = modal.querySelector('.fmodal-img-col img');
        if (modalImg && exp.image) modalImg.src = exp.image;

        const mName = modal.querySelector('.fmodal-name');
        if (mName && exp.name) mName.textContent = exp.name;

        const mRole = modal.querySelector('.fmodal-role');
        if (mRole && exp.role) mRole.textContent = exp.role;

        const mQual = modal.querySelector('.fmodal-qual');
        if (mQual && exp.qualifications) mQual.textContent = exp.qualifications;

        const mBodyParagraphs = modal.querySelectorAll('.fmodal-body p');
        if (mBodyParagraphs && mBodyParagraphs.length >= 4) {
          if (exp.summary) mBodyParagraphs[0].textContent = exp.summary;
          if (exp.expertise) mBodyParagraphs[1].textContent = exp.expertise;
          if (exp.memberships) mBodyParagraphs[2].textContent = exp.memberships;
          if (exp.industries) mBodyParagraphs[3].textContent = exp.industries;
        }
      }
    });
  }

  // Telemetry Tracker
  async function trackVisitor() {
    try {
      const path = window.location.pathname || '/';
      const referrer = document.referrer || 'Direct';
      const userAgent = navigator.userAgent;
      const device = /Mobi|Android|iPhone/i.test(userAgent) ? 'Mobile' : /iPad|Tablet/i.test(userAgent) ? 'Tablet' : 'Desktop';
      let browser = 'Chrome';
      if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
      if (userAgent.includes('Firefox')) browser = 'Firefox';
      if (userAgent.includes('Edg')) browser = 'Edge';

      await fetch(`${API_BASE}/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, referrer, userAgent, device, browser }),
      });
    } catch (e) {
      // silent
    }
  }

  // Consultation & Contact Form Submit Handler
  function setupFormListeners() {
    // Consultation Form
    const consultationForms = document.querySelectorAll('form[action*="consultation"], form#consultationForm, form.consultation-form');
    consultationForms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerText : 'Submit';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerText = 'Submitting...';
        }

        const formData = new FormData(form);
        const payload = {
          fullName: formData.get('fullName') || formData.get('name') || form.querySelector('[name="name"]')?.value || '',
          email: formData.get('email') || form.querySelector('[name="email"]')?.value || '',
          phone: formData.get('phone') || form.querySelector('[name="phone"]')?.value || '',
          company: formData.get('company') || form.querySelector('[name="company"]')?.value || '',
          serviceSelected: formData.get('service') || form.querySelector('[name="service"]')?.value || 'General Consultation',
          industry: formData.get('industry') || form.querySelector('[name="industry"]')?.value || 'General',
          budget: formData.get('budget') || form.querySelector('[name="budget"]')?.value || 'Undisclosed',
          preferredDate: formData.get('date') || form.querySelector('[name="date"]')?.value || '',
          preferredTime: formData.get('time') || form.querySelector('[name="time"]')?.value || '',
          message: formData.get('message') || form.querySelector('[name="message"]')?.value || '',
          sourcePage: window.location.pathname,
        };

        try {
          const res = await fetch(`${API_BASE}/crm/consultations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const result = await res.json();
          if (res.ok) {
            alert('Thank you! Your consultation request has been received.');
            form.reset();
          } else {
            alert(result.error || 'Failed to submit request.');
          }
        } catch (err) {
          alert('Network error. Please try again.');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
          }
        }
      });
    });

    // Contact Form
    const contactForms = document.querySelectorAll('form[action*="contact"], form#contactForm, form.contact-form');
    contactForms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerText : 'Submit';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerText = 'Sending...';
        }

        const formData = new FormData(form);
        const payload = {
          name: formData.get('name') || form.querySelector('[name="name"]')?.value || '',
          email: formData.get('email') || form.querySelector('[name="email"]')?.value || '',
          phone: formData.get('phone') || form.querySelector('[name="phone"]')?.value || '',
          subject: formData.get('subject') || form.querySelector('[name="subject"]')?.value || 'Website Inquiry',
          message: formData.get('message') || form.querySelector('[name="message"]')?.value || '',
        };

        try {
          const res = await fetch(`${API_BASE}/crm/contacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const result = await res.json();
          if (res.ok) {
            alert('Thank you for contacting us! We will get back to you shortly.');
            form.reset();
          } else {
            alert(result.error || 'Failed to send message.');
          }
        } catch (err) {
          alert('Network error. Please try again.');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
          }
        }
      });
    });
  }
})();
