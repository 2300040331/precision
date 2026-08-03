import express from 'express';
import { prisma } from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Public route for Frontend Website: GET /api/content
// Returns formatted JSON key-values for all pages or specific page
router.get('/', async (req, res) => {
  try {
    const { page } = req.query;
    
    // Fetch settings
    const settings = await prisma.setting.findUnique({ where: { id: 'global' } });
    
    // Fetch pages & visible sections
    const pages = await prisma.page.findMany({
      include: {
        sections: {
          where: { visible: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    const result = {
      settings: settings || {},
    };

    pages.forEach(p => {
      const pageData = {
        title: p.title,
        metaTitle: p.metaTitle,
        metaDesc: p.metaDesc,
        keywords: p.keywords,
      };

      p.sections.forEach(sec => {
        try {
          const parsed = JSON.parse(sec.content);
          Object.assign(pageData, parsed);
        } catch (e) {
          console.error(`Error parsing section ${sec.id} content:`, e);
        }
      });

      result[p.id] = pageData;
    });

    if (page && result[page]) {
      return res.json(result[page]);
    }

    return res.json(result);
  } catch (error) {
    console.error('Fetch content error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Admin Route: GET /api/content/pages (List all pages with sections for admin editor)
router.get('/pages', authenticateToken, async (req, res) => {
  try {
    const pages = await prisma.page.findMany({
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });
    return res.json(pages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin Route: GET /api/content/pages/:id
router.get('/pages/:id', authenticateToken, async (req, res) => {
  try {
    const page = await prisma.page.findUnique({
      where: { id: req.params.id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!page) return res.status(404).json({ error: 'Page not found' });
    return res.json(page);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin Route: PUT /api/content/pages/:id (Update page metadata)
router.put('/pages/:id', authenticateToken, async (req, res) => {
  try {
    const { title, metaTitle, metaDesc, keywords, isPublished } = req.body;
    const page = await prisma.page.update({
      where: { id: req.params.id },
      data: {
        title,
        metaTitle,
        metaDesc,
        keywords,
        isPublished,
      },
      include: { sections: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userName: req.user.name,
        action: 'UPDATE_PAGE_META',
        details: `Updated metadata for page: ${req.params.id}`,
        ipAddress: req.ip,
      },
    });

    return res.json(page);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin Route: POST /api/content/pages/:id/sections (Add section to page)
router.post('/pages/:id/sections', authenticateToken, async (req, res) => {
  try {
    const pageId = req.params.id;
    const { name, type, content, visible, order } = req.body;

    const count = await prisma.section.count({ where: { pageId } });
    const section = await prisma.section.create({
      data: {
        pageId,
        name: name || 'New Section',
        type: type || 'custom',
        visible: visible !== undefined ? Boolean(visible) : true,
        order: order !== undefined ? order : count + 1,
        content: typeof content === 'string' ? content : JSON.stringify(content || {}),
      },
    });

    return res.status(201).json(section);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin Route: PUT /api/content/sections/:id (Update section)
router.put('/sections/:id', authenticateToken, async (req, res) => {
  try {
    const { name, visible, order, content } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (visible !== undefined) updateData.visible = Boolean(visible);
    if (order !== undefined) updateData.order = Number(order);
    if (content !== undefined) {
      updateData.content = typeof content === 'string' ? content : JSON.stringify(content);
    }

    const section = await prisma.section.update({
      where: { id: req.params.id },
      data: updateData,
    });

    return res.json(section);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin Route: DELETE /api/content/sections/:id
router.delete('/sections/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.section.delete({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin Route: POST /api/content/pages/:id/reorder-sections
router.post('/pages/:id/reorder-sections', authenticateToken, async (req, res) => {
  try {
    const { sectionIds } = req.body; // array of section IDs in order
    if (!Array.isArray(sectionIds)) {
      return res.status(400).json({ error: 'sectionIds array required' });
    }

    const updates = sectionIds.map((id, index) =>
      prisma.section.update({
        where: { id },
        data: { order: index + 1 },
      })
    );

    await prisma.$transaction(updates);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
