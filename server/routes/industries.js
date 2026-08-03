import express from 'express';
import { prisma } from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Public: GET /api/industries
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    const whereCondition = all === 'true' ? {} : { active: true };
    const industries = await prisma.industry.findMany({
      where: whereCondition,
      orderBy: { order: 'asc' },
    });

    const formatted = industries.map(ind => ({
      ...ind,
      stats: typeof ind.stats === 'string' ? JSON.parse(ind.stats || '[]') : ind.stats,
      benefits: typeof ind.benefits === 'string' ? JSON.parse(ind.benefits || '[]') : ind.benefits,
      faqs: typeof ind.faqs === 'string' ? JSON.parse(ind.faqs || '[]') : ind.faqs,
    }));

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Public: GET /api/industries/:slug
router.get('/:slug', async (req, res) => {
  try {
    const industry = await prisma.industry.findUnique({
      where: { slug: req.params.slug },
    });
    if (!industry) return res.status(404).json({ error: 'Industry not found' });

    const formatted = {
      ...industry,
      stats: typeof industry.stats === 'string' ? JSON.parse(industry.stats || '[]') : industry.stats,
      benefits: typeof industry.benefits === 'string' ? JSON.parse(industry.benefits || '[]') : industry.benefits,
      faqs: typeof industry.faqs === 'string' ? JSON.parse(industry.faqs || '[]') : industry.faqs,
    };

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin: POST /api/industries
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, slug, icon, summary, image, stats, benefits, faqs, category, featured, active } = req.body;
    if (!title) return res.status(400).json({ error: 'Industry title is required' });

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const count = await prisma.industry.count();

    const industry = await prisma.industry.create({
      data: {
        title,
        slug: generatedSlug,
        icon: icon || 'Building2',
        summary: summary || '',
        image: image || '',
        category: category || 'General',
        featured: Boolean(featured),
        active: active !== undefined ? Boolean(active) : true,
        stats: typeof stats === 'string' ? stats : JSON.stringify(stats || []),
        benefits: typeof benefits === 'string' ? benefits : JSON.stringify(benefits || []),
        faqs: typeof faqs === 'string' ? faqs : JSON.stringify(faqs || []),
        order: count + 1,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userName: req.user.name,
        action: 'CREATE_INDUSTRY',
        details: `Created new industry: ${industry.title}`,
        ipAddress: req.ip,
      },
    });

    return res.status(201).json(industry);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin: PUT /api/industries/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const indId = parseInt(req.params.id);
    const { title, slug, icon, summary, image, stats, benefits, faqs, category, featured, active, order } = req.body;

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (slug !== undefined) dataToUpdate.slug = slug;
    if (icon !== undefined) dataToUpdate.icon = icon;
    if (summary !== undefined) dataToUpdate.summary = summary;
    if (image !== undefined) dataToUpdate.image = image;
    if (category !== undefined) dataToUpdate.category = category;
    if (featured !== undefined) dataToUpdate.featured = Boolean(featured);
    if (active !== undefined) dataToUpdate.active = Boolean(active);
    if (order !== undefined) dataToUpdate.order = Number(order);
    if (stats !== undefined) dataToUpdate.stats = typeof stats === 'string' ? stats : JSON.stringify(stats);
    if (benefits !== undefined) dataToUpdate.benefits = typeof benefits === 'string' ? benefits : JSON.stringify(benefits);
    if (faqs !== undefined) dataToUpdate.faqs = typeof faqs === 'string' ? faqs : JSON.stringify(faqs);

    const updated = await prisma.industry.update({
      where: { id: indId },
      data: dataToUpdate,
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin: DELETE /api/industries/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const indId = parseInt(req.params.id);
    await prisma.industry.delete({ where: { id: indId } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
