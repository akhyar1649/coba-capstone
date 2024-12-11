const express = require("express");
const { downloadModel } = require("../handlers/model-handler.js");

const router = express.Router();

router.get("/:fileName", downloadModel);

module.exports = router;
