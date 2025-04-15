// models/Log.js
import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  action: { type: String, required: true },         
  entityType: { type: String, required: true },     
  entityName: { type: String, required: true },     
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: { type: String },                       
  role: { type: String },                           // admin, user, guest
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Log', LogSchema);
