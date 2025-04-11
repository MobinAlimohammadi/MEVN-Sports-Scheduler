import express from 'express';
import League from '../models/League.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';


const router = express.Router();

// Create a new league
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const league = await League.create(req.body);
    res.status(201).json(league);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all leagues
router.get('/', async (req, res) => {
  try {
    const leagues = await League.find();
    res.json(leagues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single league by ID
router.get('/:id', async (req, res) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) return res.status(404).json({ error: 'League not found' });
    res.json(league);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (Optional) Update a league
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const updated = await League.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (Optional) Delete a league
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await League.findByIdAndDelete(req.params.id);
    res.json({ message: 'League deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
