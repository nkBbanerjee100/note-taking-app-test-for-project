import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql } from './db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// ---- SIGNUP ----
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existing = await sql`
      SELECT id FROM users WHERE username = ${username} OR email = ${email}
    `;
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Username or email already taken' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const rows = await sql`
      INSERT INTO users (username, email, password_hash)
      VALUES (${username}, ${email}, ${passwordHash})
      RETURNING id, username, email
    `;
    const user = rows[0];
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---- LOGIN ----
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const rows = await sql`
      SELECT id, username, email, password_hash FROM users WHERE username = ${username}
    `;
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---- VERIFY TOKEN (optional, for auto-login on refresh) ----
router.get('/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });

  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET);
    res.json({ user: { id: payload.id, username: payload.username } });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;