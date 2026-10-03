import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth.js';
import dataRoutes from './data.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', dataRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'DrumGate API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🏯 DrumGate API running on http://localhost:${PORT}\n`);
});
