// Precision & Co. Dynamic Content & Telemetry Sync Script
// Connects public frontend website dynamically to the Enterprise CMS Backend & Instant Storage

(function () {
  const getApiBase = () => {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      const host = window.location.hostname;
      if ((host === 'localhost' || host === '127.0.0.1') && window.location.port === '5000') {
        return `http://${host}:5000/api`;
      }
    }
    return '/api';
  };

  const API_BASE = getApiBase();

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      let pageKey = window.location.pathname.split('/').pop().replace('.html', '');
      if (!pageKey || pageKey === 'index') pageKey = 'home';
      let currentPageData = null;

      // 1. Send Visitor Telemetry
      trackVisitor();

      // 2. Fetch the current shared CMS document. Browser storage is never used
      // as content may have been changed by another admin or device.
      try {
        const res = await fetch(`${API_BASE}/getContent?page=${encodeURIComponent(pageKey)}&t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const pageData = await res.json();
          if (pageData && typeof pageData === 'object' && Object.keys(pageData).length > 0) {
            const flatData = extractPageFlatContent(pageData, pageKey);
            if (Object.keys(flatData).length > 0) {
              currentPageData = flatData;
              applyContentBindings(flatData);
            }
          }
        }
      } catch (err) {}

      // 3. Fetch the complete CMS store for shared navigation, footer, services, industries, and theme customization.
      try {
        const fullStore = await fetchFullStore();
        if (fullStore) {
          applyFullStore(fullStore, pageKey, currentPageData);
          if (fullStore.themeCustomization) {
            applyThemeCustomization(fullStore.themeCustomization, pageKey);
          }
        }
      } catch (err) {}

      // 4. Attach Consultation & Contact Form Listeners
      setupFormListeners();
    } catch (err) {
      console.warn('CMS dynamic sync warning (using cached/default content):', err);
    }
  });

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

    if (raw.flat && raw.flat[pageKey] && typeof raw.flat[pageKey] === 'object') {
      flat = { ...raw.flat[pageKey], ...flat };
    }

    if (
      Object.keys(flat).length === 0 &&
      !raw.fullStore &&
      !raw.flat &&
      !raw.pages &&
      !raw.sections
    ) {
      flat = { ...raw };
    }

    return flat;
  }

  async function fetchFullStore() {
    const res = await fetch(`${API_BASE}/getContent?page=fullStore&t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || typeof data !== 'object') return null;
    return data.fullStore || data;
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

    // 3. Experts Page & Showcase Live Sync (experts.html or pages with founders showcase)
    const showcaseEl = document.querySelector('.founders-showcase');
    if (showcaseEl || window.location.pathname.includes('experts')) {
      if (data.experts || data.expertsHeader) updateExpertsPage(data.experts, data.expertsHeader);
    }

    // 4. Why Choose Us Page Live Sync (why-choose-us.html or /why-choose-us)
    const isWhyPage = window.location.pathname.includes('why-choose-us');
    if (isWhyPage) {
      const whyData = data.whyChooseUs || data;
      const heroTitle = document.querySelector('.wcu-hero__title, .hero-title, h1');
      if (heroTitle && whyData.heroTitle) heroTitle.innerHTML = whyData.heroTitle;
      const heroDesc = document.querySelector('.wcu-hero__subtitle, .hero-desc, p.lead');
      if (heroDesc && whyData.heroDesc) heroDesc.innerHTML = whyData.heroDesc;
      const philBody = document.querySelector('.wcu-philosophy__text, .philosophy-body');
      if (philBody && whyData.philosophyBody) philBody.innerHTML = whyData.philosophyBody;
    }

    // 5. Contact Us Page Live Sync (contact.html or /contact)
    const isContactPage = window.location.pathname.includes('contact');
    if (isContactPage) {
      const cData = data.contactUs || data.contact || data;
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
    }
  }

  function updateExpertsPage(experts, expertsHeader) {
    const showcase = document.querySelector('.founders-showcase');
    if (!showcase) return;

    if (expertsHeader && expertsHeader.eyebrow) {
      const eyebrow = showcase.querySelector('.founders-showcase__eyebrow');
      if (eyebrow && expertsHeader.eyebrow && expertsHeader.eyebrow !== 'THE FOUNDERS') {
        eyebrow.textContent = expertsHeader.eyebrow;
      }
    }
      
    if (expertsHeader && expertsHeader.title) {
      const headline = showcase.querySelector('.founders-showcase__headline');
      if (headline) {
        const rawTitle = expertsHeader.title.trim();
        const cleanText = rawTitle.replace(/<[^>]*>/g, '').trim();

        const isDefaultTitle = !cleanText || 
          cleanText === 'Our Experts' || 
          cleanText === 'Built by People. Driven by Purpose.' || 
          cleanText === 'Your Vision. Our Financial Expertise' || 
          cleanText === 'Your Vision. Our Financial Expertise.';

        if (!isDefaultTitle) {
          if (cleanText.includes('Our Financial Expertise')) {
            headline.innerHTML = cleanText.replace('Our Financial Expertise', '<span class="gold-text" style="color: #c8a45e !important; -webkit-text-fill-color: #c8a45e !important; font-style: italic;">Our Financial Expertise</span>');
          } else {
            const parts = cleanText.split('.');
            if (parts.length > 1 && parts[1].trim()) {
              const firstPart = parts[0].trim();
              const remaining = parts.slice(1).join('.').trim();
              headline.innerHTML = `${firstPart}. <span class="gold-text" style="color: #c8a45e !important; -webkit-text-fill-color: #c8a45e !important; font-style: italic;">${remaining}</span>`;
            } else {
              headline.innerHTML = `<span class="gold-text" style="color: #c8a45e !important; -webkit-text-fill-color: #c8a45e !important; font-style: italic;">${cleanText}</span>`;
            }
          }
        }
      }
    }

    if (expertsHeader) {
      const subtitle = showcase.querySelector('.founders-showcase__words-sub');
      if (subtitle && expertsHeader.subtitle && expertsHeader.subtitle !== 'Words from the Founders') {
        subtitle.textContent = expertsHeader.subtitle;
      }
      const groupImage = showcase.querySelector('.founders-showcase__group-img');
      if (groupImage && expertsHeader.heroImage && expertsHeader.heroImage !== 'assets/images/founders-group.jpg' && !expertsHeader.heroImage.includes('precision team.png')) {
        groupImage.src = expertsHeader.heroImage;
      } else if (groupImage) {
        groupImage.src = 'assets/images/founders-group.jpg';
      }
    }

      // The showcase has fixed visual slots, so update those existing elements
      // rather than rebuilding them. This preserves the page's hover, click,
      // and auto-rotate interactions while applying every saved founder edit.
      const activeExperts = Array.isArray(experts)
        ? experts.filter(expert => expert && expert.active !== false)
        : [];
      const nameItems = showcase.querySelectorAll('.founders-showcase__name-item');
      const quoteItems = showcase.querySelectorAll('.founders-showcase__quote-item');
      const dots = showcase.querySelectorAll('.founders-showcase__dot');
      const spotlights = showcase.querySelectorAll('.founders-showcase__spotlight-col');

      nameItems.forEach((item, index) => {
        const expert = activeExperts[index];
        item.style.display = expert ? '' : 'none';
        if (!expert) return;
        const name = item.querySelector('.founders-showcase__name');
        const role = item.querySelector('.founders-showcase__role');
        if (name) name.textContent = expert.name || 'Founder';
        if (role) role.textContent = expert.role || '';
      });
      quoteItems.forEach((item, index) => {
        const expert = activeExperts[index];
        item.style.display = expert ? '' : 'none';
        if (!expert) return;
        const quote = item.querySelector('.founders-showcase__quote-text');
        const author = item.querySelector('.founders-showcase__quote-author');
        if (quote) quote.textContent = expert.summary || '';
        if (author) author.textContent = `— ${expert.name || 'Founder'}`;
      });
      dots.forEach((dot, index) => { dot.style.display = activeExperts[index] ? '' : 'none'; });
      spotlights.forEach((spotlight, index) => { spotlight.style.display = activeExperts[index] ? '' : 'none'; });
      return;
    }

    if (expertsHeader) {
      const h1 = document.querySelector('.founders-title');
      if (h1 && expertsHeader.title) h1.textContent = expertsHeader.title;
      const sub = document.querySelector('.founders-subtitle');
      if (sub && expertsHeader.subtitle) sub.textContent = expertsHeader.subtitle;
    }

    // The original HTML only contained six placeholder cards. Build the live
    // grid from the shared CMS list so the admin can publish 10+ experts.
    const activeExperts = Array.isArray(experts) ? experts.filter(expert => expert && expert.active !== false) : [];
    const grid = document.querySelector('.founders-grid');
    if (grid) {
      grid.innerHTML = activeExperts.map((expert, index) => `
        <div class="founder-card" data-founder="cms-${index}">
          <div class="fcard-img-wrapper">
            <img src="${escapeAttr(expert.image || 'assets/images/about-team.jpg')}" alt="${escapeAttr(expert.name || 'Expert')}">
            <div class="fcard-glass-reflection"></div>
          </div>
          <div class="fcard-info">
            <h2 class="fcard-name">${escapeHtml(expert.name || 'Expert')}</h2>
            <h3 class="fcard-role">${escapeHtml(expert.role || '')}</h3>
            <p class="fcard-qual">${escapeHtml(expert.qualifications || '')}</p>
          </div>
        </div>
      `).join('') || '<p class="founders-subtitle">Our expert profiles will be available soon.</p>';

      document.querySelectorAll('.founder-modal').forEach(modal => modal.remove());
      activeExperts.forEach((expert, index) => {
        const modal = document.createElement('div');
        modal.className = 'founder-modal';
        modal.id = `modal-cms-${index}`;
        modal.innerHTML = `
          <div class="fmodal-backdrop"></div>
          <div class="fmodal-content">
            <button class="fmodal-close" aria-label="Close modal">×</button>
            <div class="fmodal-grid">
              <div class="fmodal-text-col"><div class="fmodal-header"><span class="fmodal-label">About Our Expert</span><h2 class="fmodal-name">${escapeHtml(expert.name || 'Expert')}</h2><h3 class="fmodal-role">${escapeHtml(expert.role || '')}</h3><p class="fmodal-qual">${escapeHtml(expert.qualifications || '')}</p><div class="fmodal-divider"></div></div>
                <div class="fmodal-body"><h4>Professional Summary</h4><p>${escapeHtml(expert.summary || '')}</p><h4>Core Expertise</h4><p>${escapeHtml(expert.expertise || '')}</p><h4>Professional Memberships</h4><p>${escapeHtml(expert.memberships || '')}</p><h4>Industries Served</h4><p>${escapeHtml(expert.industries || '')}</p></div>
                <div class="fmodal-footer"><a href="contact.html" class="btn btn-primary fmodal-cta">Schedule Consultation</a></div>
              </div><div class="fmodal-img-col"><img src="${escapeAttr(expert.image || 'assets/images/about-team.jpg')}" alt="${escapeAttr(expert.name || 'Expert')}"></div>
            </div>
          </div>`;
        document.body.appendChild(modal);
      });

      grid.querySelectorAll('.founder-card').forEach(card => card.addEventListener('click', () => {
        document.getElementById(`modal-${card.dataset.founder}`)?.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      }));
      document.querySelectorAll('.founder-modal').forEach(modal => {
        const close = () => { modal.classList.remove('is-active'); document.body.style.overflow = ''; };
        modal.querySelector('.fmodal-close')?.addEventListener('click', close);
        modal.querySelector('.fmodal-backdrop')?.addEventListener('click', close);
      });
      return;
    }

    const legacyExperts = Array.isArray(experts) ? experts.filter(expert => expert && expert.active !== false) : [];

    const cards = document.querySelectorAll('.founder-card');
    cards.forEach((card, idx) => {
      const exp = legacyExperts[idx];
      const modalId = card.getAttribute('data-founder') || (idx + 1);
      const modal = document.getElementById(`modal-${modalId}`) || document.querySelectorAll('.founder-modal')[idx];
      if (!exp) {
        card.style.display = 'none';
        if (modal) modal.style.display = 'none';
        return;
      }
      card.style.display = '';
      if (modal) modal.style.display = '';

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

  const SERVICE_PUBLIC_SLUGS = {
    'services-taxation': 'services-tax',
    'services-business-advisory': 'services-consulting',
    'services-startup-advisory': 'services-startup',
    'services-compliance': 'services-regulatory',
    'services-transaction-advisory': 'services-transaction',
    'services-risk-advisory': 'services-risk',
    'services-wealth-advisory': 'services-wealth',
  };

  const INDUSTRY_PUBLIC_SLUGS = {
    'industry-global-business': 'industry-import-export',
  };

  function applyFullStore(rawStore, pageKey, pageData = null) {
    if (!rawStore || typeof rawStore !== 'object') return;
    const store = rawStore.fullStore || rawStore;

    const flatData = pageData || extractPageFlatContent(store, pageKey);
    if (flatData && Object.keys(flatData).length > 0) {
      applyContentBindings(flatData);
      applyPageChrome(flatData, pageKey);
    }

    updateSharedNavigation(store);
    updateSharedFooter(store);

    if (pageKey === 'services') {
      renderServicesHub(store, flatData);
    } else if (pageKey.startsWith('services-')) {
      const service = findServiceForPage(store, pageKey);
      if (service) renderServiceDetail(service);
    } else if (pageKey === 'industries') {
      renderIndustriesHub(store, flatData);
    } else if (pageKey.startsWith('industry-')) {
      const industry = findIndustryForPage(store, pageKey);
      if (industry) renderIndustryDetail(industry);
    }

    refreshAnimationEngines();
  }

  function applyPageChrome(data, pageKey) {
    if (!data) return;

    if (pageKey === 'services') {
      const title = document.querySelector('.services-hero__title');
      const desc = document.querySelector('.services-hero__desc');
      if (title && data.title) title.innerHTML = data.title;
      if (desc && (data.description || data.subtitle)) desc.innerHTML = data.description || data.subtitle;
    }

    if (pageKey === 'industries') {
      const title = document.querySelector('.ind-hero-title');
      const desc = document.querySelector('.ind-hero-subtitle');
      if (title && data.title) title.innerHTML = data.title;
      if (desc && (data.description || data.subtitle)) desc.innerHTML = data.description || data.subtitle;
    }

    const ctaTitle = document.querySelectorAll('.royal-cta__title, .ind-final-content h2');
    const ctaText = document.querySelectorAll('.royal-cta__text');
    const ctaButtons = document.querySelectorAll('.royal-cta__btn, .ind-btn-gold');
    ctaTitle.forEach(el => {
      if (data.ctaTitle) el.innerHTML = data.ctaTitle;
    });
    ctaText.forEach(el => {
      if (data.ctaDescription || data.ctaText) el.innerHTML = data.ctaDescription || data.ctaText;
    });
    ctaButtons.forEach(el => {
      if (data.ctaButtonText || data.buttonText) {
        const label = el.querySelector('span') || el;
        label.textContent = data.ctaButtonText || data.buttonText;
      }
      if (data.ctaButtonLink || data.buttonLink) {
        el.href = data.ctaButtonLink || data.buttonLink;
      }
    });
  }

  function updateSharedNavigation(store) {
    const services = getActiveItems(store.services);
    const industries = getActiveItems(store.industries);

    document.querySelectorAll('.mega-menu__group').forEach(group => {
      const category = group.querySelector('.mega-menu__category');
      const pane = group.querySelector('.mega-menu__pane');
      if (!category || !pane) return;

      const label = (category.textContent || '').trim().toLowerCase();
      if (label.startsWith('services') && services.length > 0) {
        pane.innerHTML = services.map(service => {
          const publicSlug = servicePublicSlug(service);
          return `<a href="${escapeAttr(publicSlug)}.html" class="mega-menu__item">${escapeHtml(service.title || publicSlug)}</a>`;
        }).join('');
      }

      if (label.startsWith('industries') && industries.length > 0) {
        pane.innerHTML = industries.map(industry => {
          const publicSlug = industryPublicSlug(industry);
          return `<a href="${escapeAttr(publicSlug)}.html" class="mega-menu__item">${escapeHtml(industry.title || publicSlug)}</a>`;
        }).join('');
      }
    });
  }

  function updateSharedFooter(store) {
    const services = getActiveItems(store.services);
    const settings = store.settings || {};
    const contact = store.contactUs || store.contact || {};
    const footerData = getFooterData(store);

    document.querySelectorAll('.footer__links-group').forEach(group => {
      const heading = group.querySelector('.footer__heading');
      const list = group.querySelector('.footer__links');
      if (!heading || !list) return;
      if ((heading.textContent || '').trim().toLowerCase() === 'services' && services.length > 0) {
        list.innerHTML = services.map(service => {
          const publicSlug = servicePublicSlug(service);
          return `<li><a href="${escapeAttr(publicSlug)}.html" class="footer__link">${escapeHtml(service.title || publicSlug)}</a></li>`;
        }).join('');
      }
    });

    document.querySelectorAll('.footer__description').forEach(el => {
      const value = footerData.description || settings.tagline;
      if (value) el.innerHTML = value;
    });

    document.querySelectorAll('.footer__copyright').forEach(el => {
      if (footerData.copyright) el.innerHTML = footerData.copyright;
    });

    document.querySelectorAll('.footer__contact-item').forEach(item => {
      const paragraphs = item.querySelectorAll('p');
      if (paragraphs.length === 0) return;
      const iconPath = item.querySelector('svg path, svg rect')?.getAttribute('d') || '';
      if (iconPath.includes('M20 10') && (footerData.address || contact.headquarters || settings.address)) {
        const address = footerData.address || contact.headquarters || settings.address;
        paragraphs[0].textContent = address;
        paragraphs.forEach((p, index) => {
          if (index > 0) p.textContent = '';
        });
      } else if (iconPath.includes('M22 16.92') && (footerData.phone || contact.primaryPhone || settings.contactPhone)) {
        paragraphs[0].textContent = footerData.phone || contact.primaryPhone || settings.contactPhone;
        if (paragraphs[1] && contact.secondaryPhone) paragraphs[1].textContent = contact.secondaryPhone;
      } else if ((footerData.email || contact.email || settings.contactEmail)) {
        paragraphs[0].textContent = footerData.email || contact.email || settings.contactEmail;
        if (paragraphs[1] && contact.taxEmail) paragraphs[1].textContent = contact.taxEmail;
      }
    });
  }

  function getFooterData(store) {
    const pages = Array.isArray(store.pages) ? store.pages : [];
    for (const page of pages) {
      const section = (page.sections || []).find(sec => sec.type === 'footer' || sec.id === 'sec-footer');
      if (!section || !section.content) continue;
      try {
        return typeof section.content === 'string' ? JSON.parse(section.content) : section.content;
      } catch (e) {}
    }
    return {};
  }

  function renderServicesHub(store, pageData = {}) {
    const services = getActiveItems(store.services);
    const grid = document.querySelector('.service-cards-grid');
    if (grid && services.length > 0) {
      grid.innerHTML = services.map((service, index) => {
        const publicSlug = servicePublicSlug(service);
        const stagger = Math.min(index + 1, 12);
        return `
          <a href="${escapeAttr(publicSlug)}.html" class="service-hub-card glass-panel reveal-up stagger-${stagger}">
            <h3>${escapeHtml(service.title || 'Service')}</h3>
            <p>${escapeHtml(service.summary || service.description || '')}</p>
            <span class="hub-card-arrow">&rarr;</span>
          </a>
        `;
      }).join('');
    }

    applyPageChrome(pageData, 'services');
  }

  function renderServiceDetail(service) {
    setDocumentMeta(service.metaTitle || service.title, service.metaDesc || service.summary || service.description, service.keywords);

    setText('.svc-hero__title', service.title);
    setText('.svc-hero__subtitle', service.heroSubtitle || service.subtitle || service.summary);
    setText('.svc-hero__desc', service.heroDescription || service.description || service.summary);
    setText('.svc-hero__ctas .btn-primary', service.heroBtnText || service.ctaText);
    setImage('.svc-hero__image img', service.heroImage || service.image, service.title);

    setText('.svc-intro__heading h2', service.introHeading);
    const introText = document.querySelector('.svc-intro__text');
    if (introText && (service.introText1 || service.introText2 || service.description)) {
      introText.innerHTML = [service.introText1 || service.description, service.introText2]
        .filter(Boolean)
        .map(text => `<p>${escapeHtml(text)}</p>`)
        .join('');
    }

    setText('.svc-capabilities .section-title', service.capabilitiesTitle || 'Our Capabilities');
    const capabilities = Array.isArray(service.capabilities) && service.capabilities.length
      ? service.capabilities
      : arrayFromStrings(service.features).map((text, index) => ({ title: `Capability ${index + 1}`, text }));
    renderServiceCards('.capabilities-grid', capabilities);

    setText('.svc-matters .section-title', service.mattersTitle || 'Why It Matters');
    renderSimpleCards('.matters-grid', service.mattersCards);

    setText('.svc-wedo .section-title', service.timelineTitle || 'What We Do');
    renderTimeline(service.timelineSteps);

    updateCurrentPageCta(service);
  }

  function renderServiceCards(selector, cards) {
    const grid = document.querySelector(selector);
    if (!grid || !Array.isArray(cards) || cards.length === 0) return;

    grid.innerHTML = cards.map(card => `
      <div class="cap-card gsap-stagger">
        ${card.image ? `<div class="cap-image"><img src="${escapeAttr(card.image)}" alt="${escapeAttr(card.title || 'Capability')}"></div>` : ''}
        <div class="cap-content">
          <h3>${escapeHtml(card.title || 'Capability')}</h3>
          <p>${escapeHtml(card.text || card.description || '')}</p>
        </div>
      </div>
    `).join('');
  }

  function renderSimpleCards(selector, cards) {
    const grid = document.querySelector(selector);
    if (!grid || !Array.isArray(cards) || cards.length === 0) return;

    grid.innerHTML = cards.map(card => `
      <div class="matter-card glass-panel gsap-stagger">
        <h3>${escapeHtml(card.title || 'Benefit')}</h3>
        <p>${escapeHtml(card.text || card.description || '')}</p>
      </div>
    `).join('');
  }

  function renderTimeline(steps) {
    const timeline = document.querySelector('.alternating-timeline');
    if (!timeline || !Array.isArray(steps) || steps.length === 0) return;

    timeline.innerHTML = steps.map((step, index) => `
      <div class="alt-block ${index % 2 === 0 ? 'left gsap-slide-right' : 'right gsap-slide-left'}">
        <div class="alt-icon">*</div>
        <h3>${escapeHtml(step.title || `Step ${index + 1}`)}</h3>
        <p>${escapeHtml(step.text || step.description || '')}</p>
      </div>
    `).join('') + '<div class="alt-line"></div>';
  }

  function renderIndustriesHub(store, pageData = {}) {
    const industries = getActiveItems(store.industries);
    const nav = document.querySelector('.ind-nav');
    const wrapper = document.querySelector('.ind-sections-wrapper');

    if (nav && industries.length > 0) {
      nav.innerHTML = industries.map(industry => {
        const publicSlug = industryPublicSlug(industry);
        const target = publicSlug.replace(/^industry-/, '');
        return `<li><a href="${escapeAttr(publicSlug)}.html" class="ind-nav-link" data-target="${escapeAttr(target)}">${escapeHtml(industry.title || target)}</a></li>`;
      }).join('');
    }

    if (wrapper && industries.length > 0) {
      wrapper.innerHTML = industries.map((industry, index) => renderIndustryHubSection(industry, index)).join('');
    }

    applyPageChrome(pageData, 'industries');
  }

  function renderIndustryHubSection(industry, index) {
    const publicSlug = industryPublicSlug(industry);
    const target = publicSlug.replace(/^industry-/, '');
    const imageBlock = `
      <div class="ind-col ind-col-img gs-reveal-img">
        <div class="ind-img-wrapper">
          <img src="${escapeAttr(industry.heroImage || industry.image || '')}" alt="${escapeAttr(industry.title || 'Industry')}">
        </div>
      </div>
    `;
    const textBlock = `
      <div class="ind-col ind-col-text gs-reveal-text">
        <div class="ind-icon-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16v16H4z"/></svg></div>
        <h2 class="ind-title">${escapeHtml(industry.title || 'Industry')}</h2>
        <div class="ind-divider"></div>
        <p class="ind-overview">${escapeHtml(industry.summary || industry.heroDescription || '')}</p>
        <div class="ind-details">
          <div class="ind-detail-block">
            <h4>${escapeHtml(industry.card1Title || 'How We Help')}</h4>
            <p>${escapeHtml(industry.card1Text || industry.heroDescription || '')}</p>
          </div>
          <div class="ind-detail-block">
            <h4>${escapeHtml(industry.card2Title || 'Specialized Support')}</h4>
            <p>${escapeHtml(industry.card2Text || industry.summary || '')}</p>
          </div>
        </div>
        <a href="${escapeAttr(publicSlug)}.html" class="ind-cta">Explore Solutions <span class="arrow">&rarr;</span></a>
      </div>
    `;
    const content = index % 2 === 0 ? `${imageBlock}${textBlock}` : `${textBlock}${imageBlock}`;
    const layout = index % 2 === 0 ? 'ind-layout-img-left' : 'ind-layout-content-left';
    return `<section class="ind-section" id="${escapeAttr(target)}"><div class="ind-floating-block ${layout}">${content}</div></section>`;
  }

  function renderIndustryDetail(industry) {
    setDocumentMeta(industry.metaTitle || `${industry.title} Industry Expertise | Precision & Co`, industry.metaDesc || industry.heroDescription || industry.summary, industry.keywords);

    setText('.idetail-hero-subtitle', industry.heroSubtitle || 'Industry Expertise');
    setText('.idetail-hero-title', industry.title);
    setText('.idetail-overview-text', industry.heroDescription || industry.summary);
    const heroBg = document.querySelector('.idetail-hero-bg');
    const heroImage = industry.heroImage || industry.image;
    if (heroBg && heroImage) heroBg.style.backgroundImage = `url('${heroImage}')`;

    setText('.idetail-section-title', industry.sectionTitle || 'How We Help');
    const cards = [
      { title: industry.card1Title, text: industry.card1Text },
      { title: industry.card2Title, text: industry.card2Text },
      { title: industry.card3Title, text: industry.card3Text },
    ].filter(card => card.title || card.text);

    if (cards.length === 0 && Array.isArray(industry.benefits)) {
      industry.benefits.slice(0, 6).forEach((benefit, index) => {
        cards.push({ title: `Solution ${index + 1}`, text: benefit });
      });
    }

    const grid = document.querySelector('.idetail-grid');
    if (grid && cards.length > 0) {
      grid.innerHTML = cards.map(card => `
        <div class="idetail-card">
          <h4>${escapeHtml(card.title || 'Solution')}</h4>
          <p>${escapeHtml(card.text || '')}</p>
        </div>
      `).join('');
    }

    updateCurrentPageCta(industry);
  }

  function updateCurrentPageCta(data) {
    if (!data) return;
    document.querySelectorAll('.royal-cta__title, .ind-final-content h2').forEach(el => {
      if (data.ctaTitle) el.innerHTML = data.ctaTitle;
    });
    document.querySelectorAll('.royal-cta__text').forEach(el => {
      if (data.ctaText) el.innerHTML = data.ctaText;
    });
  }

  function findServiceForPage(store, pageKey) {
    const aliasSlug = Object.entries(SERVICE_PUBLIC_SLUGS).find(([, publicSlug]) => publicSlug === pageKey)?.[0];
    return getActiveItems(store.services).find(service => {
      const slug = service.slug || '';
      return slug === pageKey || slug === aliasSlug || servicePublicSlug(service) === pageKey;
    });
  }

  function findIndustryForPage(store, pageKey) {
    const aliasSlug = Object.entries(INDUSTRY_PUBLIC_SLUGS).find(([, publicSlug]) => publicSlug === pageKey)?.[0];
    return getActiveItems(store.industries).find(industry => {
      const slug = industry.slug || '';
      return slug === pageKey || slug === aliasSlug || industryPublicSlug(industry) === pageKey;
    });
  }

  function servicePublicSlug(service) {
    const slug = service?.slug || slugify(service?.title || 'service');
    return SERVICE_PUBLIC_SLUGS[slug] || slug;
  }

  function industryPublicSlug(industry) {
    const slug = industry?.slug || `industry-${slugify(industry?.title || 'industry')}`;
    return INDUSTRY_PUBLIC_SLUGS[slug] || slug;
  }

  function getActiveItems(items) {
    if (!Array.isArray(items)) return [];
    return items
      .filter(item => item && item.active !== false)
      .sort((a, b) => (Number(a.order || a.id || 0) - Number(b.order || b.id || 0)));
  }

  function arrayFromStrings(value) {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string') return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function setText(selector, value) {
    if (value === undefined || value === null || value === '') return;
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  function setImage(selector, src, alt) {
    const img = document.querySelector(selector);
    if (!img || !src) return;
    img.src = src;
    if (alt) img.alt = alt;
  }

  function setDocumentMeta(title, description, keywords) {
    if (title) document.title = title.includes('Precision') ? title : `${title} | Precision & Co`;
    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', description);
    }
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) metaKeywords.setAttribute('content', keywords);
    }
  }

  function refreshAnimationEngines() {
    try {
      if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
        window.ScrollTrigger.refresh();
      }
    } catch (e) {}
  }

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .trim()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, '&#096;');
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

  // Dynamic Visual Theme Customization Engine
  function applyThemeCustomization(themeData, pageKey) {
    if (!themeData || typeof themeData !== 'object') return;

    const global = themeData.global || {};
    const page = (themeData.pages && themeData.pages[pageKey]) || {};
    const sections = themeData.sections || {};

    // 1. Dynamic Google Web Fonts Loader
    const selectedFonts = new Set();
    if (global.fontFamily) selectedFonts.add(global.fontFamily);
    if (page.fontFamily) selectedFonts.add(page.fontFamily);
    Object.values(sections).forEach(sec => {
      if (sec && sec.fontFamily) selectedFonts.add(sec.fontFamily);
    });

    if (selectedFonts.size > 0) {
      const fontsParam = Array.from(selectedFonts)
        .map(font => `family=${encodeURIComponent(font)}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,700`)
        .join('&');
      const googleFontUrl = `https://fonts.googleapis.com/css2?${fontsParam}&display=swap`;
      
      let fontLink = document.getElementById('cms-google-fonts');
      if (!fontLink) {
        fontLink = document.createElement('link');
        fontLink.id = 'cms-google-fonts';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
      }
      fontLink.href = googleFontUrl;
    }

    // 2. Generate CSS Custom Variables Stylesheet
    let css = '';

    // Global Scope (:root)
    css += ':root {\n';
    if (global.primaryColor) css += `  --color-primary: ${global.primaryColor} !important;\n`;
    if (global.secondaryColor) css += `  --color-secondary: ${global.secondaryColor} !important;\n`;
    if (global.accentColor) css += `  --color-accent: ${global.accentColor} !important; --gold-primary: ${global.accentColor} !important;\n`;
    if (global.backgroundColor) css += `  --color-[#050e17]: ${global.backgroundColor} !important;\n`;
    if (global.textColor) css += `  --color-text: ${global.textColor} !important;\n`;
    if (global.headingColor) css += `  --color-heading: ${global.headingColor} !important;\n`;
    if (global.buttonColor) css += `  --color-btn: ${global.buttonColor} !important;\n`;
    if (global.buttonHoverColor) css += `  --color-btn-hover: ${global.buttonHoverColor} !important;\n`;
    if (global.borderColor) css += `  --color-border: ${global.borderColor} !important;\n`;
    if (global.headerColor) css += `  --color-header: ${global.headerColor} !important;\n`;
    if (global.footerColor) css += `  --color-footer: ${global.footerColor} !important;\n`;
    if (global.fontFamily) css += `  --font-family-base: '${global.fontFamily}', sans-serif !important;\n`;
    css += '}\n\n';

    // Apply font family globally if specified
    if (global.fontFamily) {
      css += `body, p, span, a, input, button { font-family: '${global.fontFamily}', sans-serif !important; }\n`;
    }
    if (global.backgroundColor) {
      css += `body { background-color: ${global.backgroundColor} !important; }\n`;
    }
    if (global.textColor) {
      css += `body, p, li { color: ${global.textColor} !important; }\n`;
    }

    // Page Scope Override
    if (Object.keys(page).length > 0) {
      css += `/* Page Customization: ${pageKey} */\n`;
      if (page.backgroundColor) css += `body { background-color: ${page.backgroundColor} !important; }\n`;
      if (page.textColor) css += `body, p, li { color: ${page.textColor} !important; }\n`;
      if (page.headingColor) css += `h1, h2, h3, h4, h5, h6 { color: ${page.headingColor} !important; }\n`;
      if (page.fontFamily) css += `body, p, h1, h2, h3, h4, h5, h6 { font-family: '${page.fontFamily}', sans-serif !important; }\n`;
    }

    // Section Scope Override
    Object.keys(sections).forEach(key => {
      const parts = key.split(':');
      const secPage = parts[0];
      const secId = parts[1];
      if (secPage === pageKey && secId) {
        const secData = sections[key];
        const selector = `#${secId}, .${secId}`;
        css += `/* Section Customization: ${secId} */\n`;
        if (secData.backgroundColor) css += `${selector} { background-color: ${secData.backgroundColor} !important; background: ${secData.backgroundColor} !important; }\n`;
        if (secData.textColor) css += `${selector}, ${selector} p, ${selector} li { color: ${secData.textColor} !important; }\n`;
        if (secData.headingColor) css += `${selector} h1, ${selector} h2, ${selector} h3, ${selector} h4 { color: ${secData.headingColor} !important; }\n`;
        if (secData.fontFamily) css += `${selector}, ${selector} * { font-family: '${secData.fontFamily}', sans-serif !important; }\n`;
        if (secData.buttonColor) css += `${selector} .btn, ${selector} button { background-color: ${secData.buttonColor} !important; }\n`;
      }
    });

    // Inject or update style tag
    let styleTag = document.getElementById('cms-theme-customization');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'cms-theme-customization';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = css;
  }
})();
