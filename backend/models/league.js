import mongoose from 'mongoose';

const LeagueSchema = new mongoose.Schema({
  sport: String,
  season: String,
  ageGroup: String,
  division: String,
  gender: String,
});

export default mongoose.model('League', LeagueSchema);
