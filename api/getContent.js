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

export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  const { page } = request.query || {};

  try {
    const { blobs } = await list({ prefix: 'content.json' });

    if (blobs && blobs.length > 0) {
      const latestBlob = blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];
      const res = await fetch(latestBlob.url);
      const data = await res.json();

      if (page === 'fullStore' && data.fullStore) {
        return response.status(200).json(data.fullStore);
      }
      if (page && data[page]) {
        return response.status(200).json(data[page]);
      }
      if (data.flat) {
        if (page && data.flat[page]) {
          return response.status(200).json(data.flat[page]);
        }
        return response.status(200).json(data.flat);
      }
      return response.status(200).json(data);
    }
  } catch (error) {
    // If Blob fails, return defaultContentStore
  }

  if (page && defaultContentStore[page]) {
    return response.status(200).json(defaultContentStore[page]);
  }

  return response.status(200).json(defaultContentStore);
}
