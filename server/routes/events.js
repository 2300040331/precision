import express from 'express';

const router = express.Router();
let clients = [];

export const emitRealtimeEvent = (eventType, data) => {
  const payload = `data: ${JSON.stringify({ type: eventType, data, timestamp: new Date().toISOString() })}\n\n`;
  clients.forEach(client => client.res.write(payload));
};

router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  clients.push(newClient);

  // Send initial handshake ping
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'Real-time stream established' })}\n\n`);

  req.on('close', () => {
    clients = clients.filter(client => client.id !== clientId);
  });
});

export default router;
