const logger = require("../utils/logger");

exports.healthCheck = (req, res) => {
  logger.info("Health check endpoint called");
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
};
