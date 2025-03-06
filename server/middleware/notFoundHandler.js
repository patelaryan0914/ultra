const logger = require('../utils/logger');

exports.notFoundHandler = (req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.url}`);
  
  res.status(404).json({
    error: {
      message: 'Resource not found',
      status: 404
    }
  });
};