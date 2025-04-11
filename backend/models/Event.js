import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String }, // store time separately if you want
  address: { type: String },
  description: { type: String },
  leagueId: { type: mongoose.Schema.Types.ObjectId, ref: 'League' },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  lat: { type: Number },    
  lon: { type: Number },
});

export default mongoose.model('Event', EventSchema);
