import { api } from './api';

export async function uploadImageToBlob(file) {
  if (!file || !file.type?.startsWith('image/')) {
    throw new Error('Please select an image file.');
  }

  const response = await fetch(`/api/uploadImage?filename=${encodeURIComponent(file.name)}`, {
    method: 'POST',
    headers: api.getHeaders(false),
    body: file,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.url) {
    throw new Error(data.error || 'Image upload to Vercel Blob failed.');
  }
  return data.url;
}
