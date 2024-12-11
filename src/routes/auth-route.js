const express = require("express");
const router = express.Router();

const { signup, login, getUser } = require("../handlers/auth-handler.js");
const authenticateToken = require("../middleware/middleware.js");

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", authenticateToken, getUser);

module.exports = router;
