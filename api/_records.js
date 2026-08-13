import { kv } from '@vercel/kv';

export function setCors(response, methods) {
  response.setHeader('Access-Control-Allow-Methods', methods);
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('CDN-Cache-Control', 'no-store');
  response.setHeader('Vercel-CDN-Cache-Control', 'no-store');
}

export async function getAllRecords(prefix) {
  const ids = await kv.zrange(`${prefix}index`, 0, -1, { rev: true });
  if (!ids.length) return [];
  const records = await kv.mget(ids.map(id => `${prefix}${id}`));
  return records.filter(Boolean);
}

export async function saveRecord(prefix, record) {
  const key = `${prefix}${record.id}`;
  const value = { ...record };
  await kv.set(key, value);
  await kv.zadd(`${prefix}index`, { score: new Date(value.createdAt).getTime(), member: value.id });
  return value;
}

export async function removeRecord(prefix, record) {
  if (!record?.id) return;
  await kv.del(`${prefix}${record.id}`);
  await kv.zrem(`${prefix}index`, record.id);
}
