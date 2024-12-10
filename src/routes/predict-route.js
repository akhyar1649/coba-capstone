const express = require("express");
const router = express.Router();

const { predictForm, predictImage } = require("../handlers/predict-handler.js");

router.post("/form", predictForm);
router.post("/image", predictImage);

module.exports = router;