import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';
import { transporter } from '../utils/email.js'; // Make sure this exists!
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// --------------------- LOGIN ---------------------
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token, role: user.role, username: user.username });
});

// --------------------- REGISTER ---------------------
router.post('/register', async (req, res) => {
  const { username, email, password, role = 'user' } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed, role });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------- REQUEST PASSWORD RESET ---------------------
router.post('/request-password-reset', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'No user with that email' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      from: `"BVG Athletics" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: 'Reset Your Password',
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset it:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 1 hour.</p>
      `,
    });

    res.json({ message: 'Password reset email sent!' });
  } catch (err) {
    console.error('❌ Error sending reset email:', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

// --------------------- RESET PASSWORD ---------------------
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Token is invalid or expired.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ message: 'Password updated successfully!' });
  } catch (err) {
    console.error('❌ Error resetting password:', err.message);
    res.status(500).json({ error: 'Failed to reset password. Please try again.' });
  }
});

export default router;




