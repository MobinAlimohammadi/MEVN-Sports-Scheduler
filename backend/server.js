import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import protectedRoutes from './routes/protected.js';
import teamRoutes from './routes/teams.js';
import leagueRoutes from './routes/leagues.js';
import eventRoutes from './routes/events.js';
import configRoutes from './routes/config.js';
import logRoutes from './routes/logs.js';




dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/config', configRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB connection error ❌", err));

// Route mounting
app.use('/api/auth', authRoutes);          // → /api/auth/register, /api/auth/login
app.use('/api/protected', protectedRoutes); // → /api/protected/dashboard-data
app.use('/api/teams', teamRoutes);         // → /api/teams
app.use('/api/leagues', leagueRoutes);     // → /api/leagues
app.use('/api/events', eventRoutes);       // → /api/events
app.use('/api/logs', logRoutes);


// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
