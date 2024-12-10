const express = require("express");
const router = express.Router();

const { handlePrediction } = require("../handlers/predict-handler.js");

router.post("/form", handlePrediction);
// router.get("/image", predictImage);

module.exports = router;