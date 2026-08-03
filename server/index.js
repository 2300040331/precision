import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import servicesRoutes from './routes/services.js';
import industriesRoutes from './routes/industries.js';
import mediaRoutes from './routes/media.js';
import crmRoutes from './routes/crm.js';
import analyticsRoutes from './routes/analytics.js';
import settingsRoutes from './routes/settings.js';
import systemRoutes from './routes/system.js';
import eventsRoutes from './routes/events.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve Admin Dashboard Statically
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// Serve Uploaded Files Statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve Root Assets if needed
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/industries', industriesRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/events', eventsRoutes);

// General API Status
app.get('/api', (req, res) => {
  res.json({
    name: 'Precision & Co. Enterprise CMS API',
    status: 'ONLINE',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Precision & Co. CMS Server running on http://localhost:${PORT}`);
});
