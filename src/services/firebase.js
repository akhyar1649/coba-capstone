const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

async function createUser(email, password, name) {
  return await admin.auth().createUser({
    email,
    password,
    displayName: name,
  });
}

async function saveUserToFirestore(uid, name, email, hashedPassword) {
  return await admin.firestore().collection("users").doc(uid).set({
    uid,
    name,
    email,
    password: hashedPassword,
  });
}

async function getUserFromFirestore(id) {
  return await admin.firestore().collection("users").doc(id).get();
}

module.exports = {
  db,
  createUser,
  saveUserToFirestore,
  getUserFromFirestore,
};
