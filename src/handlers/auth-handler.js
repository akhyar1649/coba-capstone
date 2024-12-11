require("dotenv").config();
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");

const {
  createUser,
  saveUserToFirestore,
  getUserFromFirestore,
} = require("../services/firebase-services.js");
const {
  validateEmail,
  validatePassword,
} = require("../services/validation-input.js");
const { generateToken } = require("../services/jwt-services.js");

async function signup(req, res) {
  const { name: rawName, email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  if (!rawName) {
    return res.status(400).json({ message: "Invalid name" });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({
      message:
        "Password must be 8+ characters with uppercase, lowercase, number, and special character",
    });
  }

  const name = rawName.trim().replace(/\s+/g, " ");

  try {
    await admin.auth().getUserByEmail(email);
    return res.status(400).json({
      message: "Email already in use",
    });
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      try {
        const userRecord = await createUser(email, password, name);
        const hashedPassword = await bcrypt.hash(password, 10);
        await saveUserToFirestore(userRecord.uid, name, email, hashedPassword);
        return res.status(200).json({ message: "Success" });
      } catch (error) {
        console.error("Error creating user: ", error);
        return res.status(500).json({ message: "Error registering user" });
      }
    } else {
      console.error("Error checking user existence: ", error);
      return res.status(500).json({ message: "Error registering user" });
    }
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  if (!password) {
    return res.status(400).json({ message: "Invalid password" });
  }

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    const userId = userRecord.uid;
    const userDoc = await getUserFromFirestore(userId);

    if (!userDoc.exists) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const user = userDoc.data();
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = generateToken(
      {
        id: userId,
        email: user.email,
        name: user.name,
      },
      process.env.ACCESS_TOKEN_SECRET
    );
    user.password = undefined;

    return res.json({
      message: "Success",
      data: user,
      token,
    });
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      return res.status(400).json({ message: "Email not registered" });
    }
    console.error("Error logging in user: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getUser(req, res) {
  try {
    const { id } = req.user;
    const userDoc = await getUserFromFirestore(id);

    if (!userDoc.exists) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userData = userDoc.data();
    delete userData.password;

    return res.status(200).json({
      message: "Success",
      data: userData,
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  signup,
  login,
  getUser,
};
