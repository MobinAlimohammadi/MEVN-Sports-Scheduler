import express from 'express';
import Event from '../models/Event.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Create a new event
// Create a new event
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, date, address, leagueId, teams, description, lat, lon } = req.body;

    const eventData = {
      name,
      description,
      date,
      address,
      leagueId,
      teams,
      lat,
      lon
    };

    

    const event = await Event.create(eventData);

    res.status(201).json(event);
  } catch (err) {
    console.error('❌ Event creation error:', err.message);
    res.status(500).json({ error: err.message });
  }
});



// Get all events, or filter by leagueId or teamId
router.get('/', async (req, res) => {
  try {
    const { leagueId, teamId } = req.query;

    const query = {};
    if (leagueId) query.leagueId = leagueId;
    if (teamId) query.teams = teamId; // events.teams includes teamId

    const events = await Event.find(query);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (Optional) Get single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (Optional) Update an event
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (Optional) Delete an event
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
