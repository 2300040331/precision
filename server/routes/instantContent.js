import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../db.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_PATH = path.join(__dirname, '..', 'cms-store.json');

async function readSavedStore() {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function buildDatabaseStore() {
  const [settings, pages, services, industries, media] = await Promise.all([
    prisma.setting.findUnique({ where: { id: 'global' } }),
    prisma.page.findMany({
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    }),
    prisma.service.findMany({ orderBy: { order: 'asc' } }),
    prisma.industry.findMany({ orderBy: { order: 'asc' } }),
    prisma.mediaItem.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  return {
    settings: settings || {},
    pages,
    services: services.map(service => ({
      ...service,
      features: parseJsonArray(service.features),
      faqs: parseJsonArray(service.faqs),
    })),
    industries: industries.map(industry => ({
      ...industry,
      stats: parseJsonArray(industry.stats),
      benefits: parseJsonArray(industry.benefits),
      faqs: parseJsonArray(industry.faqs),
    })),
    media,
  };
}

function parseJsonArray(value) {
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value || '[]');
  } catch {
    return [];
  }
}

function flattenPage(page) {
  const flat = {
    title: page.title,
    metaTitle: page.metaTitle,
    metaDesc: page.metaDesc,
    keywords: page.keywords,
  };

  (page.sections || [])
    .filter(section => section.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .forEach(section => {
      if (!section.content) return;
      try {
        const parsed = typeof section.content === 'string' ? JSON.parse(section.content) : section.content;
        if (section.type === 'cta' || section.id === 'sec-cta') {
          if (parsed.title) flat.ctaTitle = parsed.title;
          if (parsed.description) flat.ctaDescription = parsed.description;
          if (parsed.buttonText) flat.ctaButtonText = parsed.buttonText;
          if (parsed.buttonLink) flat.ctaButtonLink = parsed.buttonLink;
        }
        Object.assign(flat, parsed);
      } catch (error) {
        console.warn(`Skipping invalid CMS section content for ${section.id}:`, error.message);
      }
    });

  return flat;
}

function extractPageContent(data, targetPage) {
  if (!data) return null;
  const store = data.fullStore || data;

  if (targetPage === 'experts' && (store.experts || store.expertsHeader)) {
    return {
      experts: store.experts || [],
      expertsHeader: store.expertsHeader || null,
    };
  }

  if (targetPage === 'why-choose-us' && store.whyChooseUs) {
    return store.whyChooseUs;
  }

  if (targetPage === 'contact' && (store.contactUs || store.contact)) {
    return store.contactUs || store.contact;
  }

  if (Array.isArray(store.pages)) {
    const page = store.pages.find(item => item && (item.id === targetPage || item.slug === targetPage));
    if (page) return flattenPage(page);
  }

  if (data.flat && data.flat[targetPage] && typeof data.flat[targetPage] === 'object') {
    return data.flat[targetPage];
  }

  if (store[targetPage] && typeof store[targetPage] === 'object') {
    return store[targetPage];
  }

  return null;
}

router.get('/getContent', async (req, res) => {
  try {
    const { page } = req.query;
    const savedStore = await readSavedStore();
    const data = savedStore || await buildDatabaseStore();

    if (page === 'fullStore') {
      return res.json(data.fullStore || data);
    }

    if (page) {
      const pageData = extractPageContent(data, page);
      return res.json(pageData || {});
    }

    return res.json(data.fullStore || data);
  } catch (error) {
    console.error('Fetch instant content error:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.post('/updateContent', async (req, res) => {
  try {
    const data = req.body || {};
    await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Update instant content error:', error);
    return res.status(500).json({ error: error.message });
  }
});

router.put('/updateContent', async (req, res) => {
  try {
    const data = req.body || {};
    await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
    return res.json({ success: true, data });
  } catch (error) {
    console.error('Update instant content error:', error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
