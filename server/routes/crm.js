import express from 'express';
import { prisma } from '../db.js';
import { authenticateToken } from './auth.js';
import { emitRealtimeEvent } from './events.js';

const router = express.Router();

// Public website submission: POST /api/crm/consultations
router.post('/consultations', async (req, res) => {
  try {
    const { fullName, email, phone, company, serviceSelected, industry, budget, preferredDate, preferredTime, message, sourcePage } = req.body;
    
    if (!fullName || !email || !phone) {
      return res.status(400).json({ error: 'Full name, email, and phone number are required.' });
    }

    const consultation = await prisma.consultation.create({
      data: {
        fullName,
        email,
        phone,
        company: company || '',
        serviceSelected: serviceSelected || 'General Consultation',
        industry: industry || 'General',
        budget: budget || 'Undisclosed',
        preferredDate: preferredDate || '',
        preferredTime: preferredTime || '',
        message: message || '',
        sourcePage: sourcePage || '/',
        ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
        status: 'NEW',
      },
    });

    // Notify connected Admin dashboards real-time
    emitRealtimeEvent('NEW_CONSULTATION', consultation);

    return res.status(201).json({
      success: true,
      message: 'Consultation request received successfully. Our team will contact you shortly.',
      id: consultation.id,
    });
  } catch (error) {
    console.error('Consultation creation error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Admin: GET /api/crm/consultations
router.get('/consultations', authenticateToken, async (req, res) => {
  try {
    const { status, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { company: { contains: search } },
      ];
    }

    const consultations = await prisma.consultation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json(consultations);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin: PUT /api/crm/consultations/:id
router.put('/consultations/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, assignedStaff, notes, preferredDate, preferredTime } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (assignedStaff !== undefined) updateData.assignedStaff = assignedStaff;
    if (notes !== undefined) updateData.notes = notes;
    if (preferredDate !== undefined) updateData.preferredDate = preferredDate;
    if (preferredTime !== undefined) updateData.preferredTime = preferredTime;

    const updated = await prisma.consultation.update({
      where: { id },
      data: updateData,
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin: DELETE /api/crm/consultations/:id
router.delete('/consultations/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.consultation.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Public website submission: POST /api/crm/contacts
router.post('/contacts', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || '',
        subject: subject || 'General Inquiry',
        message,
        status: 'UNREAD',
      },
    });

    // Real-time alert to admin
    emitRealtimeEvent('NEW_CONTACT_MESSAGE', contact);

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out. We have received your message.',
      id: contact.id,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin: GET /api/crm/contacts
router.get('/contacts', authenticateToken, async (req, res) => {
  try {
    const { status, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { subject: { contains: search } },
        { message: { contains: search } },
      ];
    }

    const contacts = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json(contacts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin: PUT /api/crm/contacts/:id
router.put('/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, replyNote } = req.body;

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: {
        status: status || undefined,
        replyNote: replyNote !== undefined ? replyNote : undefined,
      },
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin: DELETE /api/crm/contacts/:id
router.delete('/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.contactMessage.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
