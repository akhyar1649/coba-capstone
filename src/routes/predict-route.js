const express = require("express");
const multer = require('multer');
const router = express.Router();

const { predictForm, predictImage } = require("../handlers/predict-handler.js");

// Setup multer for handling file uploads
const upload = multer({
    storage: multer.memoryStorage(), // Store file in memory
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
  });

router.post("/form", predictForm);
router.post("/image", upload.single('image'), predictImage);

module.exports = router;