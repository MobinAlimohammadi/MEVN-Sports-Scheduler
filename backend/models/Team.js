// backend/models/Team.js

import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  name: String,
  coach: String,
  ageGroup: String,
  gender: String,
  leagueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
  },
});

export default mongoose.model('Team', TeamSchema);
