import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import documentRoutes from './routes/document.routes.js';
import { errorHandler } from './middleware/error.js';
import { registerEventHandlers } from './events/handlers/index.js';

export function createApp(): express.Application {
  const app = express();

  // 1. Initialize in-process Event Bus Handlers
  registerEventHandlers();

  // 2. Global Middleware & Production CORS
  app.use(
    cors({
      origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
      credentials: true,
    })
  );
  app.use(express.json());

  // 3. Health Check
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'converge-backend',
      timestamp: new Date().toISOString(),
    });
  });

  // 4. API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/documents', documentRoutes);

  // 5. Centralized Error Handler (Must be registered after routes)
  app.use(errorHandler);

  return app;
}
