const express = require("express");

const { signup, login, getUser } = require("../handlers/auth-handler.js");
const { authenticateToken } = require("../middleware/middleware.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", authenticateToken, getUser);

module.exports = router;
