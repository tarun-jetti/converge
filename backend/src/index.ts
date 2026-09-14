import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import documentRoutes from './routes/document';
import { authMiddleware as requireAuth } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'localhost:3000', // Adjust this to your frontend's origin
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/documents', requireAuth, documentRoutes);

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'converge-backend',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`[Converge Backend] Running on http://localhost:${PORT}`);
});
