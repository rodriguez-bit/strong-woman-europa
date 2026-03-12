import express from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';
import { initDb } from './config/database';
import { runMigrations } from './db/migrate';
import { errorHandler } from './middleware/errorHandler';
import collaboratorsRouter from './routes/collaborators';
import outreachRouter from './routes/outreach';
import dashboardRouter from './routes/dashboard';
import aiRouter from './routes/ai';
import importRouter from './routes/import';

async function start() {
  await initDb();
  runMigrations();

  const app = express();

  app.use(cors());
  app.use(express.json());

  // API routes
  app.use('/api/v1/collaborators', collaboratorsRouter);
  app.use('/api/v1', outreachRouter);
  app.use('/api/v1/dashboard', dashboardRouter);
  app.use('/api/v1/ai', aiRouter);
  app.use('/api/v1/import', importRouter);

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Serve React frontend in production
  if (env.NODE_ENV === 'production') {
    const clientDist = path.join(__dirname, '../../client/dist');
    app.use(express.static(clientDist));
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(clientDist, 'index.html'));
      }
    });
  }

  app.use(errorHandler);

  app.listen(env.PORT, () => {
    console.log(`Strong Woman Europa server running on port ${env.PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
