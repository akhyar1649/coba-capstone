const express = require("express");
const router = express.Router();

const { register, login } = require("../handlers/auth-handler.js");

router.post("/register", register);
router.post("/login", login);

module.exports = router;
