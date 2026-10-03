import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db.js';

const router = Router();
const SALT_ROUNDS = 12;

// ─────────────────────────────────────────────
// POST /api/auth/signup
// ─────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    // Validation
    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required.',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.',
      });
    }

    // Validate role
    const allowedRoles = ['patient', 'doctor', 'admin'];
    const userRole = allowedRoles.includes(role) ? role : 'patient';

    // Check if email already exists
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Hash the password — only the hash is stored, never the plain password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    const [result] = await pool.execute(
      'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [full_name.trim(), email.trim().toLowerCase(), passwordHash, userRole]
    );

    // Generate JWT
    const token = jwt.sign(
      {
        id: result.insertId,
        email: email.trim().toLowerCase(),
        role: userRole,
        full_name: full_name.trim(),
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: result.insertId,
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        role: userRole,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/signin
// No role input needed — role is fetched from DB
// ─────────────────────────────────────────────
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Find user by email
    const [users] = await pool.execute(
      'SELECT id, full_name, email, password_hash, role FROM users WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email.',
      });
    }

    const user = users[0];

    // Compare password hash — bcrypt handles the comparison securely
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password.',
      });
    }

    // Role is dynamically determined from the database
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: `Welcome back, ${user.full_name}.`,
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
});

// ─────────────────────────────────────────────
// GET /api/auth/me — Get current user from token
// ─────────────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user data from DB (role may have been updated)
    const [users] = await pool.execute(
      'SELECT id, full_name, email, role, created_at FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.json({
      success: true,
      user: users[0],
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.',
      });
    }
    console.error('Auth check error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong.',
    });
  }
});

export default router;
