import { put } from '@vercel/blob';
import { requireAdmin } from './_auth.js';

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }
  if (!requireAdmin(request, response)) return;

  try {
    const filename = request.query?.filename || `uploaded-image-${Date.now()}.png`;
    
    const blob = await put(filename, request, {
      access: 'public',
      addRandomSuffix: true,
    });

    return response.status(200).json(blob);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
