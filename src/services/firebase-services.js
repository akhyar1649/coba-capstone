const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: process.env.GCS_HISTORY_BUCKET_NAME,
});
const db = admin.firestore();
const bucket = admin.storage().bucket();

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
  bucket,
  createUser,
  saveUserToFirestore,
  getUserFromFirestore,
};
