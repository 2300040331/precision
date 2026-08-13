import { put } from '@vercel/blob';
import { requireAdmin } from './_auth.js';

export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('CDN-Cache-Control', 'no-store');
  response.setHeader('Vercel-CDN-Cache-Control', 'no-store');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST' && request.method !== 'PUT') {
    return response.status(405).json({ error: 'Method not allowed' });
  }
  if (!requireAdmin(request, response)) return;

  try {
    const data = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    
    // A CMS save is successful only after it reaches the shared Vercel store.
    // Serverless memory is intentionally not used because instances do not share it.
    const blob = await put('content.json', JSON.stringify(data), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
    return response.status(200).json({
      success: true,
      url: blob.url,
      publishedAt: new Date().toISOString(),
    });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
