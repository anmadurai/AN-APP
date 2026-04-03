const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');
const crypto = require('crypto');

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(`[AUTH] Login attempt received for user: ${username}`);

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Login database error:', error);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user) {
      console.error('Login user not found for:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a unique session ID for this login
    const sid = crypto.randomUUID();

    // UPDATE DB with the new session ID (effectively logging out other devices)
    const { error: updateError } = await supabase
      .from('users')
      .update({ current_session_id: sid })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // GENERATE JWT including user ID, role, and SESSION ID
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, sid: sid },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      message: 'Logged in successfully',
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// LOGOUT
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Clear session ID from DB
    await supabase
      .from('users')
      .update({ current_session_id: null })
      .eq('id', req.user.id);

    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed' });
  }
});

// ME (Check current user status)
router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
