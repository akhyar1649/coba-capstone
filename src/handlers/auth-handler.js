const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");
require("dotenv").config();

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password) {
  // Password minimal 8 karakter,satu huruf besar, satu huruf kecil, satu angka, dan satu simbol khusus
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

async function register(req, res) {
  const { name: rawName, email, password } = req.body;
  const name = rawName.trim().replace(/\s+/g, ' ');

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Masukkan Email dengan benar" });
  }
  if (!name) {
    return res.status(400).json({ message: "Masukkan Nama" });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ message: "Masukkan Password" });
  }

  try {
    await admin.auth().getUserByEmail(email);
    return res.status(400).json({
      message: "Email telah terdaftar",
    });
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      try {
        const userRecord = await admin.auth().createUser({
          email: email,
          password: password,
          displayName: name,
        });
        const hashedPassword = await bcrypt.hash(password, 10);
        await admin.firestore().collection("users").doc(userRecord.uid).set({
          uid: userRecord.uid,
          name: name,
          email: email,
          password: hashedPassword,
        });
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
    return res.status(400).json({ message: "Masukkan Email dengan benar" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    const userId = userRecord.uid;
    const userDoc = await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      return res.status(400).json({ message: "Email tidak terdaftar" });
    }
    const user = userDoc.data();

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      {
        id: userId,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1d",
      }
    );
    user.password = undefined;
    return res.json({
      message: "Success",
      data: user,
      token,
    });
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      return res.status(400).json({ message: "Email tidak terdaftar" });
    }
    console.error("Error logging in user: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  register,
  login,
};
