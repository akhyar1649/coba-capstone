const express = require("express");
const cors = require("cors");
const authRoute = require("../routes/auth-route.js");
const modelRoute = require("../routes/model-route.js");
const predictRoute = require("../routes/predict-route.js");
const db = require("../services/firebase.js");
const loadModel = require("../services/load-model.js");

const app = express();
app.use(cors());
app.use(express.json());

const host = process.env.NODE_ENV !== 'production' ? 'localhost': '0.0.0.0';
const port = 4000;

app.use("/auth", authRoute);
app.use("/model", modelRoute);
app.use("/predict", predictRoute);

const model = await loadModel(process.env.MODEL_FORM);
server.app.model = model;

app.get("/", (req, res) => {
  res.send("Rest API for SleepWell Capstone Project - Bangkit 2024");
});

app.listen(port, () => {
  console.log(`Example app listening on port http://${host}:${port}`);
});
