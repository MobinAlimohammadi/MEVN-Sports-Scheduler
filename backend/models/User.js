import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email:    { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  resetToken: String,
  resetTokenExpires: Date,
  
});

export default mongoose.model('User', UserSchema);
