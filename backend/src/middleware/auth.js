const supabase = require('../lib/supabase');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Optional auth: validates token if present, but allows request without one.
 * Sets req.user when token is valid; leaves req.user undefined otherwise.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next();
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      return next();
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    next();
  }
};

module.exports = { requireAuth, optionalAuth }; 