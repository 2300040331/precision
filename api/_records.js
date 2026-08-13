import crypto from 'node:crypto';
import { del, list, put } from '@vercel/blob';

const recordPath = (prefix, id = '') => `private-records/${prefix.replaceAll('/', '-')}${id ? `/${id}.json` : ''}`;

function encryptionKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('Private record storage has not been configured.');
  return crypto.createHash('sha256').update(secret).digest();
}

function encrypt(record) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(record), 'utf8'), cipher.final()]);
  return JSON.stringify({ v: 1, iv: iv.toString('base64url'), tag: cipher.getAuthTag().toString('base64url'), data: ciphertext.toString('base64url') });
}

function decrypt(payload) {
  const encrypted = typeof payload === 'string' ? JSON.parse(payload) : payload;
  const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(encrypted.iv, 'base64url'));
  decipher.setAuthTag(Buffer.from(encrypted.tag, 'base64url'));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(encrypted.data, 'base64url')), decipher.final()]).toString('utf8'));
}

export function setCors(response, methods) {
  response.setHeader('Access-Control-Allow-Methods', methods);
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('CDN-Cache-Control', 'no-store');
  response.setHeader('Vercel-CDN-Cache-Control', 'no-store');
}

export async function getAllRecords(prefix) {
  const { blobs } = await list({ prefix: recordPath(prefix) });
  const records = await Promise.all(blobs.map(async (blob) => {
    try {
      const result = await fetch(blob.url, { cache: 'no-store' });
      return result.ok ? decrypt(await result.text()) : null;
    } catch {
      return null;
    }
  }));
  return records.filter(Boolean).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function saveRecord(prefix, record) {
  await put(recordPath(prefix, record.id), encrypt(record), {
    access: 'public', addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 0,
  });
  return record;
}

export async function removeRecord(prefix, record) {
  if (!record?.id) return;
  const { blobs } = await list({ prefix: recordPath(prefix, record.id) });
  await Promise.all(blobs.map(blob => del(blob.url)));
}
