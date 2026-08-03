import express from 'express';
import { prisma } from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// GET /api/system/health
router.get('/health', authenticateToken, async (req, res) => {
  try {
    const [userCount, pageCount, serviceCount, mediaCount, auditCount] = await Promise.all([
      prisma.user.count(),
      prisma.page.count(),
      prisma.service.count(),
      prisma.mediaItem.count(),
      prisma.auditLog.count(),
    ]);

    return res.json({
      status: 'HEALTHY',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      counts: {
        users: userCount,
        pages: pageCount,
        services: serviceCount,
        media: mediaCount,
        auditLogs: auditCount,
      },
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
    });
  } catch (error) {
    return res.status(500).json({ status: 'UNHEALTHY', error: error.message });
  }
});

// GET /api/system/audit-logs
router.get('/audit-logs', authenticateToken, async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true, role: true },
        },
      },
    });
    return res.json(logs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/system/backup (JSON Export of Database)
router.get('/backup', authenticateToken, async (req, res) => {
  try {
    const [users, pages, sections, services, industries, media, consultations, contacts, settings] = await Promise.all([
      prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, twoFactor: true, createdAt: true } }),
      prisma.page.findMany({ include: { sections: true } }),
      prisma.section.findMany(),
      prisma.service.findMany(),
      prisma.industry.findMany(),
      prisma.mediaItem.findMany(),
      prisma.consultation.findMany(),
      prisma.contactMessage.findMany(),
      prisma.setting.findMany(),
    ]);

    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: {
        users,
        pages,
        sections,
        services,
        industries,
        media,
        consultations,
        contacts,
        settings,
      },
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=precision_cms_backup_${Date.now()}.json`);
    return res.send(JSON.stringify(backupData, null, 2));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
