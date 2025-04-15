import express from 'express';
import Team from '../models/Team.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
//import Log from '../models/Log.js';


const router = express.Router();

// Create a new team
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const team = await Team.create(req.body);

    // await Log.create({
    //   action: 'create',
    //   entityType: 'team',
    //   entityName: name,
    //   user: req.user.id,
    //   username: req.user.username,
    //   role: req.user.role,
    // });

    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get
router.get('/', async (req, res) => {
  try {
    const { leagueId } = req.query;

    const query = leagueId ? { leagueId } : {};
    const teams = await Team.find(query);
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get by ID
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update team
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const updated = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Del
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
