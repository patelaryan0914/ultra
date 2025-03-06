const express = require("express");
const router = express.Router();
const healthRoutes = require("./health.routes");
const scrapeRoutes = require("./scrape.routes");

router.use("/scrape", scrapeRoutes);
router.use("/health", healthRoutes);

module.exports = router;
