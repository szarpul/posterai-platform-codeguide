const supabase = require('../lib/supabase');
const logger = require('../utils/logger');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      logger.warn('Authentication failed: No authorization header', {
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      logger.warn('Authentication failed: No token provided', {
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      logger.warn('Authentication failed: Invalid token', {
        path: req.path,
        method: req.method,
        ip: req.ip,
        error: error.message
      });
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Add user to request object
    req.user = user;
    logger.info('Authentication successful', {
      userId: user.id,
      email: user.email,
      path: req.path,
      method: req.method
    });
    next();
  } catch (error) {
    logger.error('Auth middleware error', {
      error: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method
    });
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { requireAuth }; 