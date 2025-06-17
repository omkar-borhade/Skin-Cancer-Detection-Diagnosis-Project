// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const { uploadToGitHub } = require("../controllers/uploadController");

router.post("/upload-report", uploadToGitHub);

module.exports = router;
