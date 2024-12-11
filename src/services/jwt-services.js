const jwt = require("jsonwebtoken");

function generateToken(payload, secret, expiresIn = "1d") {
  return jwt.sign(payload, secret, { expiresIn });
}

module.exports = { generateToken };
