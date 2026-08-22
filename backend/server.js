import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://*.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow during initial setup
    }
  },
  credentials: true
}));

// Supabase Client Initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// Health Check Endpoint (For Render Liveness/Readiness Probes)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CampusConnect API',
    database: supabase ? 'connected' : 'unconfigured',
    environment: process.env.NODE_ENV || 'production'
  });
});

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CampusConnect Backend API',
    documentation: '/api/docs',
    health: '/health'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 CampusConnect Server running on port ${PORT}`);
  console.log(`📡 Health check available at http://localhost:${PORT}/health`);
});

export default app;
