import { getAllRecords, removeRecord, saveRecord, setCors } from '../_records.js';
import { requireAdmin } from '../_auth.js';

const PREFIX = 'crm/contacts/';

export default async function handler(request, response) {
  setCors(response, 'GET, POST, PUT, DELETE, OPTIONS');
  if (request.method === 'OPTIONS') return response.status(200).end();

  try {
    if (request.method !== 'POST' && !requireAdmin(request, response)) return;
    const records = request.method === 'POST' ? [] : await getAllRecords(PREFIX);
    if (request.method === 'GET') return response.status(200).json(records);

    const body = typeof request.body === 'string' ? JSON.parse(request.body) : (request.body || {});
    if (request.method === 'POST') {
      if (!body.name || !body.email || !body.message) {
        return response.status(400).json({ error: 'Name, email, and message are required.' });
      }
      const record = await saveRecord(PREFIX, {
        id: crypto.randomUUID(), name: body.name, email: body.email, phone: body.phone || '',
        subject: body.subject || 'Website Inquiry', message: body.message, status: 'UNREAD',
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      });
      return response.status(201).json({ success: true, id: record.id, record });
    }

    const record = records.find(item => item.id === body.id);
    if (!record) return response.status(404).json({ error: 'Contact message not found.' });
    if (request.method === 'DELETE') {
      await removeRecord(PREFIX, record);
      return response.status(200).json({ success: true });
    }
    if (request.method === 'PUT') {
      const updated = await saveRecord(PREFIX, { ...record, ...body, id: record.id, createdAt: record.createdAt, updatedAt: new Date().toISOString() });
      return response.status(200).json(updated);
    }
    return response.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return response.status(500).json({ error: error.message || 'CRM storage is unavailable.' });
  }
}
