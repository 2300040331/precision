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
    const cached = localStorage.getItem('precision_cms_content');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        applyContentBindings(parsed);
      } catch (e) {}
    }
  }

  // Extract content strictly belonging to the requested page or sections
  function extractPageFlatContent(raw, pageKey) {
    let flat = {};

    if (!raw) return flat;

    // Single page object returned for ?page=pageKey
    if (raw.sections && Array.isArray(raw.sections)) {
      raw.sections.forEach(sec => {
        if (sec && sec.content) {
          try {
            const parsed = typeof sec.content === 'string' ? JSON.parse(sec.content) : sec.content;
            flat = { ...flat, ...parsed };
          } catch (e) {}
        }
      });
      return flat;
    }

    // Full store object containing pages array or key-values
    if (raw.pages && Array.isArray(raw.pages)) {
      const pageObj = raw.pages.find(p => p.id === pageKey || p.slug === pageKey);
      if (pageObj && Array.isArray(pageObj.sections)) {
        pageObj.sections.forEach(sec => {
          if (sec && sec.content) {
            try {
              const parsed = typeof sec.content === 'string' ? JSON.parse(sec.content) : sec.content;
              flat = { ...flat, ...parsed };
            } catch (e) {}
          }
        });
      }
      return flat;
    }

    if (raw[pageKey] && typeof raw[pageKey] === 'object') {
      return raw[pageKey];
    }

    return typeof raw === 'object' ? raw : {};
  }

  // Freeze main website content so admin edits do not alter main website
  const FREEZE_MAIN_WEBSITE = true;

  // Apply content bindings for data-content attributes
  function applyContentBindings(data) {
    if (FREEZE_MAIN_WEBSITE) {
      // Main website remains strictly constant as designed
      return;
    }
    if (!data || typeof data !== 'object') return;
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
