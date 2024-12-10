const express = require("express");
const cors = require("cors");
const tfnode = require('@tensorflow/tfjs-node');
const authRoute = require("../routes/auth-route.js");
const modelRoute = require("../routes/model-route.js");
const predictRoute = require("../routes/predict-route.js");
const db = require("../services/firebase.js");

const app = express();
app.use(cors());
app.use(express.json());

const host = process.env.NODE_ENV !== 'production' ? 'localhost': '0.0.0.0';
const port = 4000;

app.use("/auth", authRoute);
app.use("/model", modelRoute);
app.use("/predict", predictRoute);

let model;
async function loadModel() {
    model = await tfnode.loadLayersModel(process.env.MODEL_FORM);
    console.log("Model Loaded!");
}

app.get("/", (req, res) => {
  res.send("Rest API for SleepWell Capstone Project - Bangkit 2024");
});

app.listen(port, () => {
  console.log(`Example app listening on port http://${host}:${port}`);
  loadModel();
});
