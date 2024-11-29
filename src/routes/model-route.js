const express = require("express");
const router = express.Router();

const { getVersion, getFile, downloadModel } = require("../handlers/model-handler.js");

router.get("/version", getVersion);
router.get("/file", getFile);
router.get('/:fileName', downloadModel);

module.exports = router;