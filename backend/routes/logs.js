// routes/logs.js
import express from 'express';
import Log from '../models/Log.js'; 

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
    const logs = await Log.find().sort({ timestamp: -1 }).limit(50); // get most recent 50 made
    res.json(logs);
  } catch (err) {
    console.error('❌ Failed to fetch logs:', err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

export default router;


//was going to add a logs page where the admin user would be able to see all the actions of all the users to make sure everything is in order
//also to allow for later implementation of history, where recently deleted leagues (which also delete events and teams) can be restored
