import { put } from '@vercel/blob';

export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST' && request.method !== 'PUT') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;

    try {
      const blob = await put('content.json', JSON.stringify(data), {
        access: 'public',
        addRandomSuffix: false,
      });
      return response.status(200).json({ success: true, url: blob.url, data });
    } catch (e) {
      return response.status(200).json({ success: true, warning: 'Saved locally', data });
    }
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
