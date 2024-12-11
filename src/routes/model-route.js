const express = require("express");
const router = express.Router();

const {
  getVersion,
  getFileMe,
  downloadModel,
} = require("../handlers/model-handler.js");

router.get("/version", getVersion);
router.get("/file", getFileMe);
router.get("/:fileName", downloadModel);

module.exports = router;
