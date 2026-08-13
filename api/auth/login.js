import { createSession, verifyCredentials } from '../_auth.js';

export default function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed.' });
  const body = typeof request.body === 'string' ? JSON.parse(request.body) : (request.body || {});
  const result = verifyCredentials(body.email, body.password);
  if (!result.configured) return response.status(503).json({ error: 'Admin credentials have not been configured.' });
  if (!result.valid) return response.status(401).json({ error: 'Invalid email or password.' });
  const email = String(body.email).trim().toLowerCase();
  return response.status(200).json({ token: createSession(email), user: { name: 'Administrator', email, role: 'SUPER_ADMIN' } });
}
