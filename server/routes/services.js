import express from 'express';
import { prisma } from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Public: GET /api/services (List active services for website)
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    const whereCondition = all === 'true' ? {} : { active: true };
    const services = await prisma.service.findMany({
      where: whereCondition,
      orderBy: { order: 'asc' },
    });

    // Parse JSON strings for features & FAQs
    const formatted = services.map(s => ({
      ...s,
      features: typeof s.features === 'string' ? JSON.parse(s.features || '[]') : s.features,
      faqs: typeof s.faqs === 'string' ? JSON.parse(s.faqs || '[]') : s.faqs,
    }));

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Public: GET /api/services/:slug
router.get('/:slug', async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { slug: req.params.slug },
    });
    if (!service) return res.status(404).json({ error: 'Service not found' });

    const formatted = {
      ...service,
      features: typeof service.features === 'string' ? JSON.parse(service.features || '[]') : service.features,
      faqs: typeof service.faqs === 'string' ? JSON.parse(service.faqs || '[]') : service.faqs,
    };

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin: POST /api/services (Create service)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, slug, icon, summary, description, image, features, faqs, ctaText, active, metaTitle, metaDesc, keywords } = req.body;
    if (!title) return res.status(400).json({ error: 'Service title is required' });

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const count = await prisma.service.count();

    const service = await prisma.service.create({
      data: {
        title,
        slug: generatedSlug,
        icon: icon || 'Briefcase',
        summary: summary || '',
        description: description || '',
        image: image || '',
        features: typeof features === 'string' ? features : JSON.stringify(features || []),
        faqs: typeof faqs === 'string' ? faqs : JSON.stringify(faqs || []),
        ctaText: ctaText || 'Get Started',
        active: active !== undefined ? Boolean(active) : true,
        order: count + 1,
        metaTitle: metaTitle || `${title} | Precision & Co.`,
        metaDesc: metaDesc || summary,
        keywords,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userName: req.user.name,
        action: 'CREATE_SERVICE',
        details: `Created new service: ${service.title}`,
        ipAddress: req.ip,
      },
    });

    return res.status(201).json(service);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin: PUT /api/services/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const serviceId = parseInt(req.params.id);
    const { title, slug, icon, summary, description, image, features, faqs, ctaText, active, order, metaTitle, metaDesc, keywords } = req.body;

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (slug !== undefined) dataToUpdate.slug = slug;
    if (icon !== undefined) dataToUpdate.icon = icon;
    if (summary !== undefined) dataToUpdate.summary = summary;
    if (description !== undefined) dataToUpdate.description = description;
    if (image !== undefined) dataToUpdate.image = image;
    if (features !== undefined) dataToUpdate.features = typeof features === 'string' ? features : JSON.stringify(features);
    if (faqs !== undefined) dataToUpdate.faqs = typeof faqs === 'string' ? faqs : JSON.stringify(faqs);
    if (ctaText !== undefined) dataToUpdate.ctaText = ctaText;
    if (active !== undefined) dataToUpdate.active = Boolean(active);
    if (order !== undefined) dataToUpdate.order = Number(order);
    if (metaTitle !== undefined) dataToUpdate.metaTitle = metaTitle;
    if (metaDesc !== undefined) dataToUpdate.metaDesc = metaDesc;
    if (keywords !== undefined) dataToUpdate.keywords = keywords;

    const updated = await prisma.service.update({
      where: { id: serviceId },
      data: dataToUpdate,
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userName: req.user.name,
        action: 'UPDATE_SERVICE',
        details: `Updated service ID: ${serviceId} (${updated.title})`,
        ipAddress: req.ip,
      },
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin: POST /api/services/:id/duplicate
router.post('/:id/duplicate', authenticateToken, async (req, res) => {
  try {
    const original = await prisma.service.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!original) return res.status(404).json({ error: 'Service not found' });

    const newSlug = `${original.slug}-copy-${Date.now()}`;
    const count = await prisma.service.count();

    const duplicated = await prisma.service.create({
      data: {
        title: `${original.title} (Copy)`,
        slug: newSlug,
        icon: original.icon,
        summary: original.summary,
        description: original.description,
        image: original.image,
        features: original.features,
        faqs: original.faqs,
        ctaText: original.ctaText,
        active: false, // default draft
        order: count + 1,
        metaTitle: original.metaTitle,
        metaDesc: original.metaDesc,
        keywords: original.keywords,
      },
    });

    return res.status(201).json(duplicated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin: POST /api/services/reorder
router.post('/reorder', authenticateToken, async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds array required' });

    const updates = orderedIds.map((id, index) =>
      prisma.service.update({
        where: { id: parseInt(id) },
        data: { order: index + 1 },
      })
    );

    await prisma.$transaction(updates);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin: DELETE /api/services/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const serviceId = parseInt(req.params.id);
    await prisma.service.delete({ where: { id: serviceId } });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userName: req.user.name,
        action: 'DELETE_SERVICE',
        details: `Deleted service ID: ${serviceId}`,
        ipAddress: req.ip,
      },
    });

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
