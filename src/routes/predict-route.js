const express = require("express");
const router = express.Router();

const { predictForm } = require("../handlers/predict-handler.js");

router.post("/form", predictForm);
// router.get("/image", predictImage);

module.exports = router;