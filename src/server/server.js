const express = require("express");
const cors = require("cors");
const authRoute = require("../routes/auth-route.js");
const modelRoute = require("../routes/model-route.js");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const host = "localhost";
const port = 3000;

// Import the Firebase configuration
const db = require("../config/firebase.js");

app.use("/auth", authRoute);
app.use("/model", modelRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port http://${host}:${port}`);
});
