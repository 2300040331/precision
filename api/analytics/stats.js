import { getAllRecords, setCors } from '../_records.js';
import { requireAdmin } from '../_auth.js';

const PREFIX = 'analytics/visits/';

export default async function handler(request, response) {
  setCors(response, 'GET, OPTIONS');
  if (request.method === 'OPTIONS') return response.status(200).end();
  if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' });
  if (!requireAdmin(request, response)) return;

  try {
    const visits = await getAllRecords(PREFIX);
    const now = Date.now();
    const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now); startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0);
    const today = visits.filter(visit => new Date(visit.createdAt) >= startOfToday);
    const month = visits.filter(visit => new Date(visit.createdAt) >= startOfMonth);
    const live = visits.filter(visit => now - new Date(visit.createdAt).getTime() <= 5 * 60 * 1000);
    const countBy = (items, key, fallback) => items.reduce((counts, item) => {
      const value = item[key] || fallback;
      counts[value] = (counts[value] || 0) + 1;
      return counts;
    }, {});
    const popularPages = Object.entries(countBy(visits, 'path', '/')).map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count).slice(0, 5);
    return response.status(200).json({
      totalVisitors: visits.length,
      todayVisitors: today.length,
      monthVisitors: month.length,
      liveVisitors: new Set(live.map(visit => visit.ip)).size,
      devices: countBy(visits, 'device', 'Unknown'),
      browsers: countBy(visits, 'browser', 'Unknown'),
      referrers: countBy(visits, 'referrer', 'Direct'),
      popularPages,
    });
  } catch (error) {
    return response.status(500).json({ error: error.message || 'Analytics storage is unavailable.' });
  }
}
