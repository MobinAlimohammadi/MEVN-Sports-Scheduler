// routes/logs.js
import express from 'express';
import Log from '../models/Log.js'; // We'll make this model in the next step

const router = express.Router();

// POST /api/logs — Add a log entry
router.post('/', async (req, res) => {
  try {
    const log = new Log(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    console.error('❌ Failed to log action:', err);
    res.status(500).json({ error: 'Failed to save log' });
  }
});

// GET /api/logs — Get recent logs
router.get('/', async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(50); // recent 50
    res.json(logs);
  } catch (err) {
    console.error('❌ Failed to fetch logs:', err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

export default router;
