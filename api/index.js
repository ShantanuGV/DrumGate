import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../server/auth.js';
import dataRoutes from '../server/data.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// Support both /api/auth and /auth in case rewrites strip or preserve the prefix
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

// Support both /api and / for data endpoints
app.use('/api', dataRoutes);
app.use('/', dataRoutes);

// Health check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', service: 'DrumGate API (Vercel Serverless)' });
});

export default app;
