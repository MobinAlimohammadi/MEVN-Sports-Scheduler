import express from 'express';
const router = express.Router();

router.get('/google-maps-key', (req, res) => {
  res.json({ Key: process.env.GOOGLE_MAPS_API_KEY });
});

export default router;
