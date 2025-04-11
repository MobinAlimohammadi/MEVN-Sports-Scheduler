// models/Log.js
import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  action: { type: String, required: true },         // e.g. "create", "delete"
  entityType: { type: String, required: true },     // e.g. "team", "league", "event"
  entityName: { type: String, required: true },     // e.g. "Thunderbolts"
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: { type: String },                       // helpful for display
  role: { type: String },                           // admin, user, guest
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Log', LogSchema);
