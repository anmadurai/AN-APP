const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the user is active and if the session ID matches
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, role, is_active, current_session_id')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: 'User account is deactivated' });
    }

    // SESSION SECURITY: Check if the session ID in JWT matches the one in DB
    if (decoded.sid !== user.current_session_id) {
      return res.status(401).json({ message: 'Session expired or logged in from another device' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};

module.exports = { authenticateToken, isAdmin };
