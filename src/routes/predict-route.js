const express = require("express");
const router = express.Router();

const { predictForm, predictImage } = require("../handlers/predict-handler.js");
const { authenticateToken } = require("../middleware/middleware.js");
const { upload } = require("../services/multer-services.js");

router.post("/form", authenticateToken, predictForm);
router.post("/image", authenticateToken, upload.single("image"), predictImage);

module.exports = router;
