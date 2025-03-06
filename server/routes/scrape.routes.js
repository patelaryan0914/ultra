const express = require("express");
const router = express.Router();
const {
  scrapeData,
  uploadToTrieve,
} = require("../controllers/scrape.controller");

router.get("/data", scrapeData);

router.get("/upload", uploadToTrieve);
module.exports = router;
