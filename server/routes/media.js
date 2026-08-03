import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { prisma } from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
});

// GET /api/media (List media items)
router.get('/', async (req, res) => {
  try {
    const { folder, search } = req.query;
    const where = {};
    if (folder) where.folder = folder;
    if (search) {
      where.OR = [
        { filename: { contains: search } },
        { originalName: { contains: search } },
        { altText: { contains: search } },
      ];
    }

    const items = await prisma.mediaItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/media/upload (Upload single or multiple files)
router.post('/upload', authenticateToken, upload.array('files', 10), async (req, res) => {
  try {
    const folder = req.body.folder || 'general';
    const altText = req.body.altText || '';
    const uploadedRecords = [];

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    for (const file of req.files) {
      const publicUrl = `/uploads/${file.filename}`;
      const record = await prisma.mediaItem.create({
        data: {
          filename: file.filename,
          originalName: file.originalname,
          url: publicUrl,
          mimeType: file.mimetype,
          size: file.size,
          altText: altText || file.originalname,
          folder: folder,
        },
      });
      uploadedRecords.push(record);
    }

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userName: req.user.name,
        action: 'UPLOAD_MEDIA',
        details: `Uploaded ${uploadedRecords.length} file(s) into folder: ${folder}`,
        ipAddress: req.ip,
      },
    });

    return res.status(201).json(uploadedRecords);
  } catch (error) {
    console.error('Media upload error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/media/:id (Update media altText / folder)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { altText, folder } = req.body;

    const item = await prisma.mediaItem.update({
      where: { id },
      data: {
        altText,
        folder,
      },
    });

    return res.json(item);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /api/media/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.mediaItem.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: 'File not found' });

    // Remove file from disk if local upload
    if (item.url.startsWith('/uploads/')) {
      const filePath = path.join(uploadDir, item.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.mediaItem.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        userName: req.user.name,
        action: 'DELETE_MEDIA',
        details: `Deleted media file: ${item.filename}`,
        ipAddress: req.ip,
      },
    });

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
