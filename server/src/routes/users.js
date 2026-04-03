const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// PROTECT ALL THESE ROUTES WITH ADMIN ROLE
router.use(authenticateToken);
router.use(isAdmin);

// LIST USERS
router.get('/', async (req, res) => {
  const { data: users, error } = await supabase
    .from('users')
    .select('id, username, role, is_active, current_session_id, created_at')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ message: error.message });
  res.json({ users });
});

// ADD USER
router.post('/', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const { data: user, error } = await supabase
      .from('users')
      .insert({ username, password_hash, role })
      .select('id, username, role, is_active')
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ACTIVATE/DEACTIVATE USER
router.patch('/:id/toggle-status', async (req, res) => {
  const { is_active } = req.body;
  const { error } = await supabase
    .from('users')
    .update({ is_active })
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: `User ${is_active ? 'activated' : 'deactivated'} successfully` });
});

// REVOKE LOGIN SESSION (FORCED LOGOUT)
router.post('/:id/revoke-session', async (req, res) => {
  const { error } = await supabase
    .from('users')
    .update({ current_session_id: null })
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: 'Session revoked successfully' });
});

// CHANGE PASSWORD (ADMIN ONLY)
router.patch('/:id/password', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Password is required' });

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const { error } = await supabase
      .from('users')
      .update({ password_hash, current_session_id: null }) // also revoke session automatically
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE USER
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: 'User deleted successfully' });
});

module.exports = router;
