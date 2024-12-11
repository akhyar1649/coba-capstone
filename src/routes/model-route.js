const express = require("express");
const router = express.Router();

const { downloadModel } = require("../handlers/model-handler.js");

router.get("/:fileName", downloadModel);

module.exports = router;
