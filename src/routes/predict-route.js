const express = require("express");
const router = express.Router();

const { predictForm } = require("../handlers/predict-handler.js");
const loadModel = require("../services/load-model.js");

router.post("/form", loadModel);
// router.get("/image", predictImage);

module.exports = router;