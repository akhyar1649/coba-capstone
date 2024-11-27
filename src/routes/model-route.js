const express = require("express");
const router = express.Router();

const { getVersion, getFile } = require("../handlers/model-handler.js");

router.post("/version", getVersion);
router.post("/file", getFile);

module.exports = router;