import { saveRecord, setCors } from '../_records.js';

const PREFIX = 'analytics/visits/';

export default async function handler(request, response) {
  setCors(response, 'POST, OPTIONS');
  if (request.method === 'OPTIONS') return response.status(200).end();
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : (request.body || {});
    const forwarded = request.headers['x-forwarded-for'];
    const ip = Array.isArray(forwarded) ? forwarded[0] : String(forwarded || request.socket?.remoteAddress || 'unknown').split(',')[0].trim();
    await saveRecord(PREFIX, {
      id: crypto.randomUUID(), ip, path: body.path || '/', referrer: body.referrer || 'Direct',
      userAgent: body.userAgent || 'Unknown', device: body.device || 'Desktop', browser: body.browser || 'Unknown',
      createdAt: new Date().toISOString(),
    });
    return response.status(201).json({ success: true });
  } catch (error) {
    return response.status(500).json({ error: error.message || 'Analytics storage is unavailable.' });
  }
}
