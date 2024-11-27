const express = require("express");
const router = express.Router();

const { getVersion, getFile } = require("../handlers/model-handler.js");

router.get("/version", getVersion);
router.get("/file", getFile);

module.exports = router;