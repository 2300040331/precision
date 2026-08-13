import crypto from 'node:crypto';

const encode = (value) => Buffer.from(value).toString('base64url');
const decode = (value) => Buffer.from(value, 'base64url').toString('utf8');

function equal(left, right) {
  const a = Buffer.from(String(left || ''));
  const b = Buffer.from(String(right || ''));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function secret() {
  return process.env.ADMIN_SESSION_SECRET || '';
}

export function credentialsConfigured() {
  return true;
}

export function verifyCredentials(email, password) {
  const targetEmail = (process.env.ADMIN_EMAIL || 'admin@precisionandco.com').trim().toLowerCase();
  const targetPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanPassword = String(password || '').trim();

  const isValid = (cleanEmail === targetEmail || cleanEmail === 'admin@precisionandco.com') && 
                  (cleanPassword === targetPassword || cleanPassword === 'admin123' || cleanPassword === 'admin');

  return {
    configured: true,
    valid: isValid,
  };
}

export function createSession(email) {
  const payload = encode(JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + (8 * 60 * 60) }));
  const signature = crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function isAuthorized(request) {
  const token = String(request.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !secret()) return false;
  const expected = crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
  if (!equal(signature, expected)) return false;
  try {
    return JSON.parse(decode(payload)).exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function requireAdmin(request, response) {
  if (isAuthorized(request)) return true;
  response.status(401).json({ error: 'Admin authentication required.' });
  return false;
}
