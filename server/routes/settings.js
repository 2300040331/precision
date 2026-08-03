import express from 'express';
import { prisma } from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Public / Admin: GET /api/settings
router.get('/', async (req, res) => {
  try {
    let settings = await prisma.setting.findUnique({ where: { id: 'global' } });
    if (!settings) {
      settings = await prisma.setting.create({ data: { id: 'global' } });
    }
    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin: PUT /api/settings
router.put('/', authenticateToken, async (req, res) => {
  try {
    const updated = await prisma.setting.upsert({
      where: { id: 'global' },
      update: req.body,
      create: { id: 'global', ...req.body },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userName: req.user.name,
        action: 'UPDATE_SETTINGS',
        details: 'Updated global site settings and SEO configuration.',
        ipAddress: req.ip,
      },
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Public: GET /sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
  try {
    const services = await prisma.service.findMany({ where: { active: true } });
    const industries = await prisma.industry.findMany({ where: { active: true } });

    const baseUrl = 'https://precisionandco.com';
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    const staticPages = ['/index.html', '/home.html', '/services.html', '/industries.html', '/why-choose-us.html', '/experts.html', '/contact.html'];
    staticPages.forEach(p => {
      xml += `  <url><loc>${baseUrl}${p}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>\n`;
    });

    services.forEach(s => {
      xml += `  <url><loc>${baseUrl}/${s.slug}.html</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;
    });

    industries.forEach(i => {
      xml += `  <url><loc>${baseUrl}/${i.slug}.html</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    return res.send(xml);
  } catch (error) {
    return res.status(500).send('Error generating sitemap');
  }
});

// Public: GET /robots.txt
router.get('/robots.txt', async (req, res) => {
  try {
    const setting = await prisma.setting.findUnique({ where: { id: 'global' } });
    res.header('Content-Type', 'text/plain');
    return res.send(setting?.robotsTxt || 'User-agent: *\nAllow: /');
  } catch (error) {
    return res.status(500).send('User-agent: *\nAllow: /');
  }
});

export default router;
