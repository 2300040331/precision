import { list } from '@vercel/blob';

// Default static content fallback matching main website fields
const defaultContentStore = {
  home: {
    title: 'Precision in<br>Numbers.<br>Excellence in<br><span class="gold-text">Business.</span>',
    subtitle: 'ACCURATE. TRUSTED. IMPACTFUL.',
    description: 'We deliver strategic financial solutions with accuracy, integrity and insight to help your business grow with confidence.',
    ctaPrimaryText: 'Our Services',
    ctaPrimaryLink: 'services.html',
    ctaSecondaryText: 'Book a Consultation',
    ctaSecondaryLink: 'contact.html',
    heroImage: 'assets/images/hero-bg.jpg',
  },
  contact: {
    primaryPhone: '+91 98765 43210',
    secondaryPhone: '+91 40 2300 4033',
    email: 'info@precisionandco.com',
    taxEmail: 'advisory@precisionandco.com',
    headquarters: 'Precision House, Level 4, Financial District, Gachibowli, Hyderabad, Telangana 500032',
    workingHours: 'Monday - Friday: 9:00 AM - 6:00 PM IST',
  },
};

function extractPageContent(data, targetPage) {
  if (!data) return null;

  const store = data.fullStore || data;

  if (targetPage === 'experts') {
    if (store.experts || store.expertsHeader) {
      return {
        experts: store.experts || [],
        expertsHeader: store.expertsHeader || null,
        themeCustomization: store.themeCustomization || null,
      };
    }
  }

  if (targetPage === 'why-choose-us') {
    if (store.whyChooseUs) {
      return store.whyChooseUs;
    }
  }

  if (targetPage === 'contact') {
    if (store.contactUs) {
      return store.contactUs;
    }
  }

  if (store.pages && Array.isArray(store.pages)) {
    const pageObj = store.pages.find(p => p.id === targetPage || p.slug === targetPage);
    if (pageObj && Array.isArray(pageObj.sections)) {
      let pageFlat = {};
      pageObj.sections.forEach(sec => {
        if (sec && sec.content) {
          try {
            const parsed = typeof sec.content === 'string' ? JSON.parse(sec.content) : sec.content;
            if (sec.type === 'cta' || sec.id === 'sec-cta') {
              if (parsed.title) pageFlat.ctaTitle = parsed.title;
              if (parsed.description) pageFlat.ctaDescription = parsed.description;
            } else {
              pageFlat = { ...parsed, ...pageFlat };
            }
          } catch (e) {}
        }
      });
      if (Object.keys(pageFlat).length > 0) return pageFlat;
    }
  }

  if (data.flat && data.flat[targetPage] && typeof data.flat[targetPage] === 'object') {
    return data.flat[targetPage];
  }

  if (data[targetPage] && typeof data[targetPage] === 'object') {
    return data[targetPage];
  }

  return null;
}

export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  // Public pages must always receive the document just published by an admin.
  // These headers prevent Vercel's CDN or a browser from serving an older CMS
  // response after a serverless write has completed.
  response.setHeader('CDN-Cache-Control', 'no-store');
  response.setHeader('Vercel-CDN-Cache-Control', 'no-store');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  const { page } = request.query || {};

  // 1. Fetch from Vercel Blob storage first (ensures global sync across serverless instances)
  try {
      const { blobs } = await list({ prefix: 'content.json' });

    if (blobs && blobs.length > 0) {
      const latestBlob = blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];
      const res = await fetch(`${latestBlob.url}?t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (page === 'fullStore') {
          return response.status(200).json(data.fullStore || data);
        }
        if (page) {
          const pageData = extractPageContent(data, page);
          if (pageData) return response.status(200).json(pageData);
          if (defaultContentStore[page]) return response.status(200).json(defaultContentStore[page]);
        }
        return response.status(200).json(data.fullStore || data);
      }
    }
  } catch (error) {
    console.error('Unable to read CMS content from Vercel Blob:', error.message);
    return response.status(503).json({ error: 'The shared CMS store is temporarily unavailable.' });
  }

  // No document has been published yet. Static markup remains the initial content only.
  if (page && defaultContentStore[page]) {
    return response.status(200).json(defaultContentStore[page]);
  }

  return response.status(200).json(defaultContentStore);
}
